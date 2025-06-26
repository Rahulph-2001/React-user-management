import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateAdminProfile } from './../redux/slices/adminSlices';

const UpdateAdminProfile = () => {
  const dispatch = useDispatch();
  const { admin, loading, error } = useSelector((state) => state.admin);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePic: null,
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        mobile: admin.mobile || '',
        profilePic: null,
      });
      // Show current profile pic
      if (admin.profilePic) {
        const formattedPath = admin.profilePic.replace(/\\/g, '/');
        setPreviewUrl(`http://localhost:5000/${formattedPath}`);
      }
    }
  }, [admin]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    }
  }, [error, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePic: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('mobile', formData.mobile);
    if (formData.profilePic) {
      submitData.append('profilePic', formData.profilePic);
    }

    try {
      await dispatch(updateAdminProfile(submitData)).unwrap();
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: err.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Update Admin Profile</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePic">Profile Picture</Label>
              <Input
                id="profilePic"
                name="profilePic"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="mt-2 w-32 h-32 rounded-full object-cover"
                />
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateAdminProfile;
