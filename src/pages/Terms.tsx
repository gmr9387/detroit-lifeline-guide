import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Terms() {
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
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Terms of Service</CardTitle>
                <CardDescription>
                  Last updated: August 7, 2025
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <section>
              <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
              <p className="text-muted-foreground mb-4">
                By accessing and using Detroit Resource Navigator, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Service Description</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Government Service Access</h4>
                    <p className="text-muted-foreground text-sm">
                      Connect Detroit residents to government programs, services, and community resources.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Business License Training</h4>
                    <p className="text-muted-foreground text-sm">
                      Provide guidance and training for business license applications and requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Community Resources</h4>
                    <p className="text-muted-foreground text-sm">
                      Directory of local businesses, farmers markets, and community organizations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service for lawful purposes only</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Report any security concerns or issues</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Service Limitations</h3>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    Detroit Resource Navigator is a digital platform that connects users to government 
                    services. We do not guarantee approval of applications or eligibility for programs. 
                    Users are responsible for verifying information and meeting program requirements.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Intellectual Property</h3>
              <p className="text-muted-foreground">
                The content, features, and functionality of Detroit Resource Navigator are owned by 
                Detroit Resource Navigator and are protected by copyright, trademark, and other 
                intellectual property laws. You may not copy, modify, or distribute our content 
                without explicit permission.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Privacy and Data</h3>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Please review our Privacy Policy to understand 
                    how we collect, use, and protect your information. By using our service, you 
                    consent to our data practices as described in our Privacy Policy.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
              <p className="text-muted-foreground">
                We strive to provide reliable service but cannot guarantee uninterrupted access. 
                The service may be temporarily unavailable due to maintenance, updates, or technical 
                issues. We will notify users of planned maintenance when possible.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground">
                Detroit Resource Navigator is provided "as is" without warranties of any kind. 
                We are not liable for any damages arising from the use of our service, including 
                but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Changes to Terms</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting. Your continued use of the service constitutes acceptance 
                of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="font-medium">Detroit Resource Navigator</p>
                <p className="text-sm text-muted-foreground">Email: legal@detroitnavigator.org</p>
                <p className="text-sm text-muted-foreground">Phone: (313) 555-0123</p>
                <p className="text-sm text-muted-foreground">Address: Detroit, Michigan</p>
              </div>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                These terms of service are effective as of August 7, 2025. By using Detroit Resource 
                Navigator, you acknowledge that you have read, understood, and agree to be bound by 
                these terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}