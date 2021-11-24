export type Flashcard = {
    id: number;
    front: string;
    back: string;
    is_known: boolean;
    is_reviewed: boolean;
    category_id: number;
};

export type Category = {
    id: number;
    name: string;
};
