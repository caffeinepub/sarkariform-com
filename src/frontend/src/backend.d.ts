import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface RecruitmentPost {
    id: bigint;
    status: PostStatus;
    postType: RecruitmentPostType;
    title: string;
    vacancyDetails: string;
    createdAt: Time;
    tags: Array<string>;
    eligibility: string;
    updatedAt: Time;
    applicationFee: string;
    officialLinks: Array<KeyValue>;
    importantDates: Array<KeyValue>;
    organization: string;
    ageLimit: string;
    examPostName: string;
}
export interface KeyValue {
    key: string;
    value: string;
}
export interface UserProfile {
    name: string;
}
export enum PostStatus {
    published = "published",
    draft = "draft"
}
export enum RecruitmentPostType {
    result = "result",
    answerKey = "answerKey",
    recruitmentForm = "recruitmentForm",
    admitCard = "admitCard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(postType: RecruitmentPostType, title: string, organization: string, examPostName: string, importantDates: Array<KeyValue>, eligibility: string, applicationFee: string, ageLimit: string, vacancyDetails: string, officialLinks: Array<KeyValue>, tags: Array<string>): Promise<bigint>;
    deletePost(id: bigint): Promise<void>;
    getAllPosts(): Promise<Array<RecruitmentPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPostById(id: bigint): Promise<RecruitmentPost | null>;
    getPostsByType(postType: RecruitmentPostType): Promise<Array<RecruitmentPost>>;
    getPublishedPosts(): Promise<Array<RecruitmentPost>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishPost(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPostsByTag(tag: string): Promise<Array<RecruitmentPost>>;
    unpublishPost(id: bigint): Promise<void>;
    updatePost(id: bigint, postType: RecruitmentPostType, title: string, organization: string, examPostName: string, importantDates: Array<KeyValue>, eligibility: string, applicationFee: string, ageLimit: string, vacancyDetails: string, officialLinks: Array<KeyValue>, tags: Array<string>): Promise<void>;
}
