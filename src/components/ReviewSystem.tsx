import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  Heart,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { UserReview, SuccessStory, Program } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface ReviewSystemProps {
  programId: string;
  programName: string;
  showAddReview?: boolean;
  showSuccessStories?: boolean;
  maxReviews?: number;
}

export function ReviewSystem({ 
  programId, 
  programName, 
  showAddReview = true, 
  showSuccessStories = true,
  maxReviews 
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: '',
    applicationStatus: 'pending' as const,
    waitTime: '',
    benefitsReceived: [] as string[]
  });
  const [newStory, setNewStory] = useState({
    title: '',
    story: '',
    isAnonymous: false,
    tags: [] as string[]
  });

  useEffect(() => {
    loadReviews();
    loadSuccessStories();
  }, [programId]);

  const loadReviews = () => {
    let allReviews = storageUtils.getReviewsForProgram(programId);
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (maxReviews) {
      allReviews = allReviews.slice(0, maxReviews);
    }
    
    setReviews(allReviews);
  };

  const loadSuccessStories = () => {
    let allStories = storageUtils.getSuccessStoriesForProgram(programId);
    allStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSuccessStories(allStories);
  };

  const handleSubmitReview = () => {
    if (!newReview.review.trim()) return;

    const review: UserReview = {
      id: Date.now().toString(),
      programId,
      programName,
      rating: newReview.rating,
      review: newReview.review.trim(),
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      userId: 'user-' + Date.now(), // In real app, this would be actual user ID
      userName: 'Anonymous User', // In real app, this would be actual user name
      applicationStatus: newReview.applicationStatus,
      waitTime: newReview.waitTime ? parseInt(newReview.waitTime) : undefined,
      benefitsReceived: newReview.benefitsReceived
    };

    storageUtils.saveReview(review);
    setNewReview({ rating: 5, review: '', applicationStatus: 'pending', waitTime: '', benefitsReceived: [] });
    setIsReviewDialogOpen(false);
    loadReviews();
  };

  const handleSubmitStory = () => {
    if (!newStory.title.trim() || !newStory.story.trim()) return;

    const story: SuccessStory = {
      id: Date.now().toString(),
      title: newStory.title.trim(),
      story: newStory.story.trim(),
      programId,
      programName,
      authorId: 'user-' + Date.now(),
      authorName: newStory.isAnonymous ? 'Anonymous' : 'Community Member',
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      tags: newStory.tags,
      isAnonymous: newStory.isAnonymous
    };

    storageUtils.saveSuccessStory(story);
    setNewStory({ title: '', story: '', isAnonymous: false, tags: [] });
    setIsStoryDialogOpen(false);
    loadSuccessStories();
  };

  const handleHelpful = (reviewId: string) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, helpfulCount: review.helpfulCount + 1 };
      }
      return review;
    });
    
    updatedReviews.forEach(review => storageUtils.saveReview(review));
    setReviews(updatedReviews);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'denied':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>
          {showAddReview && (
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Review *</label>
                    <Textarea
                      value={newReview.review}
                      onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                      placeholder="Share your experience with this program..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Application Status</label>
                    <Select 
                      value={newReview.applicationStatus} 
                      onValueChange={(value: any) => setNewReview({ ...newReview, applicationStatus: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Wait Time (days)</label>
                    <Input
                      type="number"
                      value={newReview.waitTime}
                      onChange={(e) => setNewReview({ ...newReview, waitTime: e.target.value })}
                      placeholder="How many days did you wait?"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitReview} className="flex-1" disabled={!newReview.review.trim()}>
                      Submit Review
                    </Button>
                    <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No reviews yet</p>
              {showAddReview && (
                <p className="text-sm mt-1">Be the first to share your experience!</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <Badge variant={getStatusColor(review.applicationStatus)} className="text-xs">
                          {getStatusIcon(review.applicationStatus)}
                          {review.applicationStatus}
                        </Badge>
                        {review.waitTime && (
                          <span className="text-xs text-muted-foreground">
                            {review.waitTime} days wait
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2">{review.review}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {review.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {review.helpfulCount}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Success Stories Section */}
      {showSuccessStories && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Success Stories</h3>
            <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Share Story
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Success Story</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={newStory.title}
                      onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                      placeholder="Give your story a title..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Your Story *</label>
                    <Textarea
                      value={newStory.story}
                      onChange={(e) => setNewStory({ ...newStory, story: e.target.value })}
                      placeholder="Share how this program helped you..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={newStory.isAnonymous}
                      onChange={(e) => setNewStory({ ...newStory, isAnonymous: e.target.checked })}
                    />
                    <label htmlFor="anonymous" className="text-sm">Share anonymously</label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitStory} className="flex-1" disabled={!newStory.title.trim() || !newStory.story.trim()}>
                      Share Story
                    </Button>
                    <Button variant="outline" onClick={() => setIsStoryDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {successStories.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No success stories yet</p>
                <p className="text-sm mt-1">Share your story to inspire others!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {successStories.map((story) => (
                <Card key={story.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{story.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{story.story}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {story.authorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(story.createdAt)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Heart className="h-3 w-3" />
                        {story.helpfulCount}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}