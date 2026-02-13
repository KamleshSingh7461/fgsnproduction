import { getMatchDetails } from '@/lib/actions';
import { MatchView } from '@/components/MatchView';
import { notFound } from 'next/navigation';

export default async function MatchPage({ params }: { params: { id: string } }) {
    const match = await getMatchDetails(params.id);

    if (!match) {
        notFound();
    }

    return <MatchView initialMatch={match} />;
}
