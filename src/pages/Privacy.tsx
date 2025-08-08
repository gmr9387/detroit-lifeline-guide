import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Users, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Privacy Policy</CardTitle>
                <CardDescription>
                  Last updated: August 7, 2025
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <section>
              <h3 className="text-lg font-semibold mb-3">Introduction</h3>
              <p className="text-muted-foreground mb-4">
                Detroit Resource Navigator ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use 
                our mobile application and website.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Personal Information</h4>
                    <p className="text-muted-foreground text-sm">
                      Household size, income level, zip code, language preference, and primary needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Application Data</h4>
                    <p className="text-muted-foreground text-sm">
                      Government program applications, business license progress, and training completion.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Usage Data</h4>
                    <p className="text-muted-foreground text-sm">
                      Pages visited, features used, and interaction patterns to improve our service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide personalized government service recommendations</li>
                <li>Track application progress and send helpful reminders</li>
                <li>Improve our services based on usage patterns</li>
                <li>Connect you with relevant community resources</li>
                <li>Ensure secure and reliable service delivery</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your information. 
                    Your data is encrypted in transit and at rest. We never share your personal 
                    information with third parties without your explicit consent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Offline Functionality</h3>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    Our app works offline and stores data locally on your device. When you're online, 
                    data syncs securely with our servers. You can control what information is shared.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Control what information is shared</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="font-medium">Detroit Resource Navigator</p>
                <p className="text-sm text-muted-foreground">Email: privacy@detroitnavigator.org</p>
                <p className="text-sm text-muted-foreground">Phone: (313) 555-0123</p>
              </div>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                This privacy policy is effective as of August 7, 2025. We may update this policy 
                from time to time and will notify users of any material changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}