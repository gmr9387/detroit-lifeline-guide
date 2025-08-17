import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storageUtils } from '@/utils/localStorage';

export default function Profile() {
  const profile = storageUtils.getUserProfile();

  const clearAll = () => {
    storageUtils.clearAllData();
    window.location.reload();
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <div className="bg-primary rounded-xl p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <p className="text-primary-foreground/90">Manage your saved info</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profile ? (
              <div className="grid gap-1">
                <div><strong>ZIP:</strong> {profile.zipCode}</div>
                <div><strong>Household Size:</strong> {profile.householdSize}</div>
                <div><strong>Primary Needs:</strong> {profile.primaryNeeds.join(', ')}</div>
                <div><strong>Language:</strong> {profile.language}</div>
              </div>
            ) : (
              <div>No profile yet. Start onboarding to personalize recommendations.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={clearAll}>Clear All Data</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}