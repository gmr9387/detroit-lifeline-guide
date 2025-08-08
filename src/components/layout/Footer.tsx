import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, FileText, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detroit Resource Navigator</h3>
            <p className="text-sm text-muted-foreground">
              Connecting Detroit residents to government services and community resources, 
              24/7, in your language, from your phone.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Built for Detroit, by Detroit</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Government Programs
                </Link>
              </li>
              <li>
                <Link to="/business-licenses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Business Licenses
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@detroitnavigator.org" className="hover:text-foreground transition-colors">
                  info@detroitnavigator.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+13135550123" className="hover:text-foreground transition-colors">
                  (313) 555-0123
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Detroit, Michigan</span>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Detroit Resource Navigator. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with ❤️ in Detroit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}