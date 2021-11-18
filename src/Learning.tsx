import { useParams } from 'react-router-dom';

export function Learning() {
    const { categoryname } = useParams<{ categoryname: string }>();
    return <main>learning flashcards in category {categoryname}</main>;
}
