export interface TUser {
	id: string
	name: string
	email: string
	description: string
	avatar: string
	gender: string
	birthday: string
	cityId: string
	subcategoriesIds: (string | undefined)[]
}

export interface TServerUser extends TUser {
	passwordHash: string
}

export type TRegisterUser = Omit<TUser, 'id'> & {
	password: string // на клиенте он хешируется, но тип остаётся
}

export type TLoginUser = {
	email: string
	password: string
}

export type TUpdateUserPass = {
	id: string
	password: string
}

export type TUpdateUser = Partial<Omit<TUser, 'id'>> & { id: string }

// Categories
export interface TCategory {
	id: string
	name: string
	type: 'business' | 'creative' | 'languages' | 'education' | 'home' | 'health'
}

// Subcategories
export interface TSubCategory {
	id: string
	name: string
	categoryId: string
}

// Cities
export interface TCity {
	id: string
	name: string
}

// Offers
export interface TOffer {
	id: string
	userId: string
	name: string
	subcategoryId: string
	description: string
	images: (string | undefined)[]
	userLikedIds: (string | undefined)[]
	createdAt?: string
	updatedAt?: string
}

export type TOfferCreate = Omit<TOffer, 'id' | 'userId' | 'userLikedIds'>
export type TOfferUpdate = Omit<Partial<Omit<TOffer, 'id'>>, 'userId'> & {
	id: string
}
