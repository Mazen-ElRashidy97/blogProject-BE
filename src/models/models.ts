export interface UserModel {
    id: number;
    name: string;
    email: string;
    password: string;
    created_date: Date;
    updated_date: Date;
}

export interface BlogModel {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_date: Date;
    updated_date: Date;
}

export interface CategoryModel {
    id: number;
    name: string;
}

export interface BlogCategoryModel {
    blog_id: number;
    category_id: number;
}

export interface UserSignUpBody {
    name: string;
    email: string;
    password: string;
}

export interface UserSignUpBody {
    name: string;
    email: string;
    password: string;
}

export type UserLoginBody = Omit<UserSignUpBody, 'name'>;

export type UserLogInServiceRes = Omit<UserModel, 'password'> & { token: string };

export type BlogDataBody = Pick<BlogModel, 'title' | 'content'> & { category: string[] };

export type BlogDataBodyUpdate = Pick<BlogModel, 'title' | 'content'> & { category: string[], blogId: number };




