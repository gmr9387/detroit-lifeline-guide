-- Detroit Resource Navigator Database Schema
-- This file contains all the SQL needed to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE application_status AS ENUM ('saved', 'started', 'submitted', 'approved', 'denied');
CREATE TYPE license_status AS ENUM ('researching', 'preparing', 'submitted', 'under-review', 'approved', 'denied');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    household_size INTEGER NOT NULL DEFAULT 1,
    has_children BOOLEAN NOT NULL DEFAULT false,
    income TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    primary_needs TEXT[] NOT NULL DEFAULT '{}',
    language TEXT NOT NULL DEFAULT 'English',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    program_id TEXT NOT NULL,
    program_name TEXT NOT NULL,
    status application_status NOT NULL DEFAULT 'saved',
    applied_at TIMESTAMP WITH TIME ZONE,
    documents_checked TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business license applications table
CREATE TABLE business_license_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    license_id TEXT NOT NULL,
    license_name TEXT NOT NULL,
    status license_status NOT NULL DEFAULT 'researching',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    documents_completed TEXT[] NOT NULL DEFAULT '{}',
    training_completed TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT,
    estimated_completion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training progress table
CREATE TABLE training_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    license_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, license_id, module_id)
);

-- Local businesses table
CREATE TABLE local_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone TEXT NOT NULL,
    website TEXT NOT NULL,
    email TEXT NOT NULL,
    hours JSONB NOT NULL DEFAULT '{}',
    services TEXT[] NOT NULL DEFAULT '{}',
    owner_name TEXT NOT NULL,
    owner_story TEXT NOT NULL,
    years_in_business INTEGER NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farmers markets table
CREATE TABLE farmers_markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    hours JSONB NOT NULL DEFAULT '{}',
    season TEXT NOT NULL,
    vendors INTEGER NOT NULL DEFAULT 0,
    categories TEXT[] NOT NULL DEFAULT '{}',
    features TEXT[] NOT NULL DEFAULT '{}',
    phone TEXT NOT NULL,
    website TEXT NOT NULL,
    email TEXT NOT NULL,
    daily_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    seasonal_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market vendors table
CREATE TABLE market_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES farmers_markets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    products TEXT[] NOT NULL DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business reviews table
CREATE TABLE business_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES local_businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page views analytics table
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application events analytics table
CREATE TABLE application_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training events analytics table
CREATE TABLE training_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs table (for dynamic program data)
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility JSONB NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    documents TEXT[] NOT NULL DEFAULT '{}',
    contact JSONB NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{}',
    application_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business licenses table (for dynamic license data)
CREATE TABLE business_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '{}',
    documents TEXT[] NOT NULL DEFAULT '{}',
    fees JSONB NOT NULL DEFAULT '{}',
    timeline TEXT NOT NULL,
    contact JSONB NOT NULL DEFAULT '{}',
    training_modules JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

CREATE INDEX idx_business_license_applications_user_id ON business_license_applications(user_id);
CREATE INDEX idx_business_license_applications_status ON business_license_applications(status);
CREATE INDEX idx_business_license_applications_created_at ON business_license_applications(created_at DESC);

CREATE INDEX idx_training_progress_user_id ON training_progress(user_id);
CREATE INDEX idx_training_progress_license_id ON training_progress(license_id);
CREATE INDEX idx_training_progress_completed ON training_progress(completed);

CREATE INDEX idx_local_businesses_category ON local_businesses(category);
CREATE INDEX idx_local_businesses_verified ON local_businesses(verified);
CREATE INDEX idx_local_businesses_location ON local_businesses(latitude, longitude);

CREATE INDEX idx_farmers_markets_season ON farmers_markets(season);
CREATE INDEX idx_farmers_markets_location ON farmers_markets(latitude, longitude);

CREATE INDEX idx_market_vendors_market_id ON market_vendors(market_id);
CREATE INDEX idx_market_vendors_verified ON market_vendors(verified);

CREATE INDEX idx_business_reviews_business_id ON business_reviews(business_id);
CREATE INDEX idx_business_reviews_user_id ON business_reviews(user_id);
CREATE INDEX idx_business_reviews_rating ON business_reviews(rating);

CREATE INDEX idx_page_views_page ON page_views(page);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_timestamp ON page_views(timestamp DESC);

CREATE INDEX idx_application_events_program_id ON application_events(program_id);
CREATE INDEX idx_application_events_user_id ON application_events(user_id);
CREATE INDEX idx_application_events_timestamp ON application_events(timestamp DESC);

CREATE INDEX idx_training_events_license_id ON training_events(license_id);
CREATE INDEX idx_training_events_user_id ON training_events(user_id);
CREATE INDEX idx_training_events_timestamp ON training_events(timestamp DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_programs_category ON programs(category);
CREATE INDEX idx_programs_name ON programs(name);

CREATE INDEX idx_business_licenses_category ON business_licenses(category);
CREATE INDEX idx_business_licenses_name ON business_licenses(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_license_applications_updated_at BEFORE UPDATE ON business_license_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_progress_updated_at BEFORE UPDATE ON training_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_local_businesses_updated_at BEFORE UPDATE ON local_businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farmers_markets_updated_at BEFORE UPDATE ON farmers_markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_vendors_updated_at BEFORE UPDATE ON market_vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_reviews_updated_at BEFORE UPDATE ON business_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_licenses_updated_at BEFORE UPDATE ON business_licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_license_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

-- Business license applications policies
CREATE POLICY "Users can view own license applications" ON business_license_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own license applications" ON business_license_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own license applications" ON business_license_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own license applications" ON business_license_applications FOR DELETE USING (auth.uid() = user_id);

-- Training progress policies
CREATE POLICY "Users can view own training progress" ON training_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own training progress" ON training_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own training progress" ON training_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own training progress" ON training_progress FOR DELETE USING (auth.uid() = user_id);

-- Business reviews policies
CREATE POLICY "Anyone can view business reviews" ON business_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON business_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON business_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON business_reviews FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies (read-only for users, full access for analytics)
CREATE POLICY "Users can view own analytics" ON page_views FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can insert page views" ON page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own application events" ON application_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert application events" ON application_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own training events" ON training_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert training events" ON training_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Public data policies (read-only for everyone)
CREATE POLICY "Anyone can view local businesses" ON local_businesses FOR SELECT USING (true);
CREATE POLICY "Anyone can view farmers markets" ON farmers_markets FOR SELECT USING (true);
CREATE POLICY "Anyone can view market vendors" ON market_vendors FOR SELECT USING (true);
CREATE POLICY "Anyone can view programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Anyone can view business licenses" ON business_licenses FOR SELECT USING (true);

-- Create functions for common operations

-- Function to get user's application count
CREATE OR REPLACE FUNCTION get_user_application_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM applications 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's license application count
CREATE OR REPLACE FUNCTION get_user_license_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM business_license_applications 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get nearby businesses
CREATE OR REPLACE FUNCTION get_nearby_businesses(
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    radius_km DECIMAL DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    description TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lb.id,
        lb.name,
        lb.category,
        lb.description,
        lb.address,
        lb.latitude,
        lb.longitude,
        (
            6371 * acos(
                cos(radians(lat)) * 
                cos(radians(lb.latitude)) * 
                cos(radians(lb.longitude) - radians(lng)) + 
                sin(radians(lat)) * 
                sin(radians(lb.latitude))
            )
        ) AS distance_km
    FROM local_businesses lb
    WHERE (
        6371 * acos(
            cos(radians(lat)) * 
            cos(radians(lb.latitude)) * 
            cos(radians(lb.longitude) - radians(lng)) + 
            sin(radians(lat)) * 
            sin(radians(lb.latitude))
        )
    ) <= radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get business statistics
CREATE OR REPLACE FUNCTION get_business_stats()
RETURNS TABLE (
    total_businesses BIGINT,
    verified_businesses BIGINT,
    categories_count JSONB,
    avg_rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_businesses,
        COUNT(*) FILTER (WHERE verified = true)::BIGINT as verified_businesses,
        jsonb_object_agg(category, count) as categories_count,
        AVG(avg_rating) as avg_rating
    FROM (
        SELECT 
            lb.category,
            COUNT(*) as count,
            AVG(br.rating) as avg_rating
        FROM local_businesses lb
        LEFT JOIN business_reviews br ON lb.id = br.business_id
        GROUP BY lb.category
    ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing

-- Sample local businesses
INSERT INTO local_businesses (name, category, description, address, latitude, longitude, phone, website, email, hours, services, owner_name, owner_story, years_in_business, highlights, verified) VALUES
('Detroit Bike Shop', 'automotive', 'Full-service bicycle shop and repair center', '1234 Michigan Ave, Detroit, MI 48216', 42.3314, -83.0458, '(313) 555-0101', 'https://detroitbikeshop.com', 'info@detroitbikeshop.com', '{"monday": "9:00 AM - 6:00 PM", "tuesday": "9:00 AM - 6:00 PM", "wednesday": "9:00 AM - 6:00 PM", "thursday": "9:00 AM - 6:00 PM", "friday": "9:00 AM - 6:00 PM", "saturday": "10:00 AM - 4:00 PM"}', '["bike-repair", "sales", "maintenance", "custom-builds"]', 'Mike Johnson', 'Started as a hobby, now serving the community for 15 years', 15, '["eco-friendly", "community-focused", "expert-repair"]', true),
('Soul Food Kitchen', 'food-service', 'Authentic soul food restaurant with family recipes', '5678 Woodward Ave, Detroit, MI 48201', 42.3314, -83.0458, '(313) 555-0202', 'https://soulfoodkitchen.com', 'info@soulfoodkitchen.com', '{"monday": "11:00 AM - 9:00 PM", "tuesday": "11:00 AM - 9:00 PM", "wednesday": "11:00 AM - 9:00 PM", "thursday": "11:00 AM - 9:00 PM", "friday": "11:00 AM - 10:00 PM", "saturday": "12:00 PM - 10:00 PM", "sunday": "12:00 PM - 8:00 PM"}', '["dine-in", "takeout", "catering", "delivery"]', 'Sarah Williams', 'Family recipes passed down for generations', 8, '["family-owned", "authentic-recipes", "community-staple"]', true);

-- Sample farmers markets
INSERT INTO farmers_markets (name, description, address, latitude, longitude, hours, season, vendors, categories, features, phone, website, email, daily_fee, seasonal_fee, requirements) VALUES
('Eastern Market', 'Detroit''s largest and most historic public market', '2934 Russell St, Detroit, MI 48207', 42.3484, -83.0427, '{"saturday": "6:00 AM - 4:00 PM", "sunday": "10:00 AM - 4:00 PM"}', 'Year-round', 225, '["produce", "meat", "dairy", "baked-goods", "crafts"]', '["parking", "restrooms", "food-court", "live-music"]', '(313) 833-9300', 'https://easternmarket.org', 'info@easternmarket.org', 25.00, 500.00, '["business-license", "food-safety-cert", "insurance"]'),
('Downtown Detroit Farmers Market', 'Fresh produce and local goods in the heart of downtown', '1001 Woodward Ave, Detroit, MI 48226', 42.3314, -83.0458, '{"wednesday": "11:00 AM - 3:00 PM", "friday": "11:00 AM - 3:00 PM"}', 'May-October', 45, '["produce", "flowers", "honey", "artisan-goods"]', '["downtown-location", "easy-access", "variety"]', '(313) 555-0303', 'https://downtownmarket.org', 'info@downtownmarket.org', 15.00, 300.00, '["vendor-permit", "food-handler-cert"]');

-- Sample programs
INSERT INTO programs (name, category, description, eligibility, benefits, documents, contact, languages, application_url) VALUES
('SNAP Benefits', 'food', 'Supplemental Nutrition Assistance Program for low-income families', '{"income_limit": "130%_poverty_level", "citizenship": "required", "work_requirements": "varies"}', '["monthly-food-assistance", "ebt-card", "accepted-at-most-stores"]', '["proof-of-income", "id-documents", "utility-bills"]', '{"phone": "(800) 481-4989", "website": "https://www.michigan.gov/mdhhs/assistance-programs/food/snap", "email": "snap@michigan.gov"}', '["English", "Spanish", "Arabic"]', 'https://newmibridges.michigan.gov/'),
('Section 8 Housing', 'housing', 'Housing Choice Voucher Program for affordable housing', '{"income_limit": "50%_area_median", "citizenship": "required", "background_check": "required"}', '["rental-assistance", "choice-of-housing", "portable-benefits"]', '["proof-of-income", "background-check", "housing-history"]', '{"phone": "(313) 456-3000", "website": "https://detroitmi.gov/housing", "email": "housing@detroitmi.gov"}', '["English", "Spanish"]', 'https://detroitmi.gov/housing/apply');

-- Sample business licenses
INSERT INTO business_licenses (name, category, description, requirements, documents, fees, timeline, contact, training_modules) VALUES
('Restaurant License', 'food-service', 'License required to operate a restaurant or food service establishment', '{"business_registration": "required", "food_safety": "required", "inspections": "required", "insurance": "required", "zoning": "required"}', '["business-registration", "food-safety-cert", "insurance-cert", "zoning-approval"]', '{"application": 150, "annual": 300, "inspection": 75}', '4-6 weeks', '{"department": "Health Department", "phone": "(313) 876-4000", "website": "https://detroitmi.gov/health", "address": "100 Mack Ave, Detroit, MI 48201"}', '[{"id": "food-safety-basics", "title": "Food Safety Basics", "duration": "2 hours", "topics": ["hygiene", "temperature-control", "cross-contamination"]}]'),
('Food Truck License', 'food-service', 'Mobile food service license for food trucks and carts', '{"business_registration": "required", "food_safety": "required", "vehicle_inspection": "required", "insurance": "required", "zoning": "required"}', '["business-registration", "food-safety-cert", "vehicle-inspection", "insurance-cert"]', '{"application": 200, "annual": 400, "vehicle": 100}', '3-4 weeks', '{"department": "Health Department", "phone": "(313) 876-4000", "website": "https://detroitmi.gov/health", "address": "100 Mack Ave, Detroit, MI 48201"}', '[{"id": "mobile-food-safety", "title": "Mobile Food Safety", "duration": "3 hours", "topics": ["mobile-operations", "temperature-control", "sanitation"]}]');

-- Create views for common queries

-- View for user dashboard data
CREATE VIEW user_dashboard AS
SELECT 
    p.id as user_id,
    p.email,
    p.household_size,
    p.primary_needs,
    COUNT(DISTINCT a.id) as application_count,
    COUNT(DISTINCT bla.id) as license_application_count,
    COUNT(DISTINCT CASE WHEN a.status = 'approved' THEN a.id END) as approved_applications,
    COUNT(DISTINCT CASE WHEN bla.status = 'approved' THEN bla.id END) as approved_licenses
FROM profiles p
LEFT JOIN applications a ON p.id = a.user_id
LEFT JOIN business_license_applications bla ON p.id = bla.user_id
GROUP BY p.id, p.email, p.household_size, p.primary_needs;

-- View for business statistics
CREATE VIEW business_stats AS
SELECT 
    category,
    COUNT(*) as total_businesses,
    COUNT(*) FILTER (WHERE verified = true) as verified_businesses,
    AVG(years_in_business) as avg_years_in_business
FROM local_businesses
GROUP BY category;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;