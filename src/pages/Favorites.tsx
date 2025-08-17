import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import detroitResources from '@/data/detroitResources.json';
import { Program } from '@/types';
import { storageUtils } from '@/utils/localStorage';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight, Heart } from 'lucide-react';

export default function Favorites() {
  const navigate = useNavigate();
  const favorites = storageUtils.getFavorites();
  const allPrograms = (detroitResources.programs as Program[]) || [];
  const favoritePrograms = allPrograms.filter(p => favorites.includes(p.id));

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <div className="bg-primary rounded-xl p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-5 w-5" /> Favorites
          </h1>
          <p className="text-primary-foreground/90">
            {favoritePrograms.length} saved programs
          </p>
        </div>

        {favoritePrograms.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have no saved programs yet.
              </p>
              <Button onClick={() => navigate('/programs')}>Browse Programs</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favoritePrograms.map((program) => (
              <Card key={program.id} className="transition-smooth hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {program.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {program.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Link to={`/program/${program.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => window.open(program.applicationUrl, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}