export interface User {
  name: string;
  login: string;
  html_url: string;
  avatar_url: string;
}

export interface UserResponse extends User {
  login: string;
}

export interface Repo {
  id: number;
  name: string;
  html_url: string;
  private: boolean;
  stargazers_count: number;
}

export interface Branch {
  name: string;
}

export type Languages = {
  [key: string]: number;
};

export type GetRepoResponse = Repo[];
