export interface Profile {
  username: string;
}

export interface ProjectParticipant {
  profiles: Profile;
}

export interface CreatedBy {
  username: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  overview: string;
  created_at: string;
  updated_at: string;
  created_by: CreatedBy;
  project_participants: ProjectParticipant[];
}

export type UserType = "teacher" | "student";
