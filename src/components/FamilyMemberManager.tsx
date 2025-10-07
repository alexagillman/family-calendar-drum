import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateFamilyMember, useFamilyMembers } from '@/hooks/use-calendar';
import { toast } from 'sonner';
import { Plus, User } from '@phosphor-icons/react';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export function FamilyMemberManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const { data: familyMembers = [] } = useFamilyMembers();
  const createMember = useCreateFamilyMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await createMember.mutateAsync({
        name: name.trim(),
        color: selectedColor,
      });
      
      setName('');
      setSelectedColor(PRESET_COLORS[0]);
      setIsOpen(false);
      toast.success('Family member added successfully');
    } catch (error) {
      toast.error('Failed to add family member');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Family Members
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-1" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Name</Label>
                  <Input
                    id="member-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter family member name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMember.isPending}>
                    Add Member
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {familyMembers.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No family members added yet. Add some to assign events to specific people.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {familyMembers.map(member => (
              <Badge
                key={member._id}
                style={{ backgroundColor: member.color }}
                className="text-white"
              >
                <User size={12} className="mr-1" />
                {member.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}