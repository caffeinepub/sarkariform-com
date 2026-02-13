import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KeyValueEditor from './KeyValueEditor';
import type { RecruitmentPost, RecruitmentPostType, KeyValue } from '@/backend';

interface PostEditorFormProps {
  initialData?: RecruitmentPost;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
}

export interface PostFormData {
  postType: RecruitmentPostType;
  title: string;
  organization: string;
  examPostName: string;
  importantDates: KeyValue[];
  eligibility: string;
  applicationFee: string;
  ageLimit: string;
  vacancyDetails: string;
  officialLinks: KeyValue[];
  tags: string[];
}

export default function PostEditorForm({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting,
}: PostEditorFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    postType: (initialData?.postType || 'recruitmentForm') as RecruitmentPostType,
    title: initialData?.title || '',
    organization: initialData?.organization || '',
    examPostName: initialData?.examPostName || '',
    importantDates: initialData?.importantDates || [],
    eligibility: initialData?.eligibility || '',
    applicationFee: initialData?.applicationFee || '',
    ageLimit: initialData?.ageLimit || '',
    vacancyDetails: initialData?.vacancyDetails || '',
    officialLinks: initialData?.officialLinks || [],
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postType">Post Type *</Label>
            <Select
              value={formData.postType}
              onValueChange={(value) => setFormData({ ...formData, postType: value as RecruitmentPostType })}
            >
              <SelectTrigger id="postType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruitmentForm">Recruitment Form</SelectItem>
                <SelectItem value="admitCard">Admit Card</SelectItem>
                <SelectItem value="result">Result</SelectItem>
                <SelectItem value="answerKey">Answer Key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization/Department *</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examPostName">Exam/Post Name *</Label>
            <Input
              id="examPostName"
              value={formData.examPostName}
              onChange={(e) => setFormData({ ...formData, examPostName: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Dates & Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <KeyValueEditor
            label="Important Dates"
            items={formData.importantDates}
            onChange={(items) => setFormData({ ...formData, importantDates: items })}
            keyPlaceholder="Event (e.g., Application Start)"
            valuePlaceholder="Date"
          />

          <KeyValueEditor
            label="Official Links"
            items={formData.officialLinks}
            onChange={(items) => setFormData({ ...formData, officialLinks: items })}
            keyPlaceholder="Link Label (e.g., Apply Online)"
            valuePlaceholder="URL"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eligibility">Eligibility</Label>
            <Textarea
              id="eligibility"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationFee">Application Fee</Label>
            <Textarea
              id="applicationFee"
              value={formData.applicationFee}
              onChange={(e) => setFormData({ ...formData, applicationFee: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageLimit">Age Limit</Label>
            <Input
              id="ageLimit"
              value={formData.ageLimit}
              onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vacancyDetails">Vacancy/Selection Details</Label>
            <Textarea
              id="vacancyDetails"
              value={formData.vacancyDetails}
              onChange={(e) => setFormData({ ...formData, vacancyDetails: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
