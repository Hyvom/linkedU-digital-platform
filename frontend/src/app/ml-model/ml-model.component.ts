import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MlModelService } from '../core/services/ml-model.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AgentService } from '../core/services/agent.service';
import { ChatService } from '../core/services/chat.service';
import {
  AgentProfileResponse,
  AssignedStudent
} from '../shared/models/models';

@Component({
  selector: 'app-ml-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ml-model.html',
  styleUrl: './ml-model.component.css'
})
export class MlModelComponent implements OnInit, OnDestroy {
  predictionForm = {
    country: '',
    major: '',
    language: '',
    moyenne: null as number | null,
    tuitionTier: null as number | null,
  };

  predictionResult: string | null = null;
  recommendations: any[] = [];
  isLoading = false;
  error: string | null = null;

  // ── Sidebar Logic ──
  agentId = 0;
  agentProfile: AgentProfileResponse | null = null;
  isLoadingAgentProfile = true;
  unreadMessagesCount = 0;
  students: AssignedStudent[] = [];
  selectedStudentId: number | null = null;

  countries = ['France', 'Germany', 'Italy', 'Morocco', 'China', 'UK', 'Russia', 'Unknown'];
  majors = ['engineering', 'craftsmanship', 'business', 'vocational_training', 'hotel_tourism', 'sports_management', 'industrial_trades', 'technology', 'applied_sciences', 'digital_engineering', 'it_engineering', 'real_estate', 'digital_tools', 'civil_engineering', 'science_technology', 'multidisciplinary', 'management', 'health_sciences', 'chinese_medicine', 'general_studies', 'test_preparation'];
  languagesList = ['french', 'bilingual', 'english', 'italian', 'russian', 'chinese'];
  tuitionTiersList = [1, 2, 3];
  moyennesList = [10.0, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0];

  private intervalId: any = null;
  private isBrowser: boolean;

  constructor(
    private readonly mlModelService: MlModelService,
    private readonly authService: AuthService,
    private readonly agentService: AgentService,
    private readonly chatService: ChatService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.agentId = Number(this.authService.getUserId());
      if (this.agentId) {
        this.loadAgentProfile();
        this.loadUnreadMessagesCount();
        this.loadStudentsCount();
        this.loadMetadata();
        
        this.intervalId = setInterval(() => this.loadUnreadMessagesCount(), 30000);
      }
    }
  }

  private loadMetadata(): void {
    // This method assumes you add getMetadata() to MlModelService
    // calling http://localhost:8000/metadata
    this.mlModelService.getMetadata().subscribe({
      next: (data: any) => {
        if (data.countries) this.countries = data.countries;
        if (data.majors) this.majors = data.majors;
        if (data.languages) this.languagesList = data.languages;
      },
      error: (err: any) => console.warn('Could not load metadata from FastAPI, using defaults.', err)
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private loadAgentProfile(): void {
    this.agentService.getMyAgentProfile().subscribe({
      next: (data) => {
        this.agentProfile = data;
        this.isLoadingAgentProfile = false;
      },
      error: () => this.isLoadingAgentProfile = false
    });
  }

  private loadUnreadMessagesCount(): void {
    this.chatService.getUnreadMessages(this.agentId).subscribe({
      next: (msgs) => this.unreadMessagesCount = msgs.length,
      error: () => this.unreadMessagesCount = 0
    });
  }

  private loadStudentsCount(): void {
    this.agentService.getMyStudents(this.agentId).subscribe({
      next: (data) => this.students = data
    });
  }

  onStudentChange(): void {
    if (!this.selectedStudentId) return;
    
    this.agentService.getStudentProfile(this.selectedStudentId).subscribe({
      next: (profile: any) => {
        if (profile.speciality) this.predictionForm.major = profile.speciality.toLowerCase();
        // You can map other fields here if they exist in your student profile
      }
    });
  }

  getAgentAvatarUrl(): string {
    if (!this.agentProfile?.avatar) return '';
    if (this.agentProfile.avatar.startsWith('http')) return this.agentProfile.avatar;
    return 'http://localhost:8080' + this.agentProfile.avatar;
  }

  getAgentInitials(): string {
    const f = this.agentProfile?.user?.firstName?.charAt(0) || '';
    const l = this.agentProfile?.user?.lastName?.charAt(0) || '';
    return (f + l).toUpperCase() || '??';
  }

  getAgentStatusClass(): string {
    if (this.agentProfile?.onlineStatus === 'ONLINE') return 'status-online';
    if (this.agentProfile?.onlineStatus === 'AWAY') return 'status-away';
    return 'status-offline';
  }

  onSubmit(): void {
    this.isLoading = true;
    this.error = null;
    this.predictionResult = null;

    // Basic validation for required fields
    if (
      !this.predictionForm.country ||
      !this.predictionForm.major ||
      !this.predictionForm.language ||
      this.predictionForm.moyenne === null ||
      this.predictionForm.tuitionTier === null
    ) {
      this.error = 'Please fill in all fields.';
      this.isLoading = false;
      return;
    }

    const payload = {
      country: this.predictionForm.country,
      major: this.predictionForm.major,
      language: this.predictionForm.language,
      moyenne: Number(this.predictionForm.moyenne),
      tuition_tier: Number(this.predictionForm.tuitionTier),
    };

    this.mlModelService.predictAdmission(payload).subscribe({
      next: (response) => {
        this.recommendations = response.recommendations || [];
        if (this.recommendations.length > 0) {
          this.predictionResult = `Succès : ${this.recommendations.length} universités recommandées trouvées.`;
        } else {
          this.predictionResult = 'Aucune recommandation trouvée pour ces critères.';
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Prediction error:', err);
        this.error = err.error?.message || 'Failed to get prediction. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}