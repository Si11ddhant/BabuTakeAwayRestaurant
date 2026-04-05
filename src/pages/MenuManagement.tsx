import React, { useState } from 'react';
import { useMenuItems, MenuItem } from '@/hooks/useMenuItems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, Edit2, Trash2, Check, X, 
  Image as ImageIcon, Loader2, AlertCircle, ChevronDown, 
  Filter, MoreVertical, Package, Tag, UtensilsCrossed 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const MenuManagement: React.FC = () => {
  const { 
    menuItems, categories, loading, error, 
    addMenuItem, updateMenuItem, deleteMenuItem 
  } = useMenuItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0] || '',
      image_url: '',
      is_available: true,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || '',
      is_available: item.is_available ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setIsDeleting(id);
    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted successfully');
    } catch (err) {
      toast.error('Failed to delete menu item');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url,
      is_available: formData.is_available,
    };

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
        toast.success('Menu item updated successfully');
      } else {
        await addMenuItem(payload);
        toast.success('Menu item added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(editingItem ? 'Failed to update item' : 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && menuItems.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">Menu Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium uppercase tracking-widest">
            Control your restaurant's digital menu.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-3">
              <Plus className="w-5 h-5" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {editingItem ? 'Edit Menu Item' : 'New Menu Item'}
              </DialogTitle>
              <DialogDescription className="text-indigo-100 text-xs font-medium uppercase tracking-widest mt-1 opacity-80">
                {editingItem ? 'Modify the details of your dish.' : 'Add a fresh new taste to your menu.'}
              </DialogDescription>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Dish Name</Label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g., Butter Chicken Rolls"
                    className="h-14 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Price (₹)</Label>
                    <Input 
                      required 
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className="h-14 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={val => setFormData({...formData, category: val})}
                    >
                      <SelectTrigger className="h-14 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat} className="font-bold text-xs uppercase tracking-widest">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</Label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell your customers about this dish..."
                    className="w-full h-24 p-4 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Image URL</Label>
                  <Input 
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="h-14 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Available</Label>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Toggle visibility on menu</p>
                  </div>
                  <Switch 
                    checked={formData.is_available}
                    onCheckedChange={checked => setFormData({...formData, is_available: checked})}
                  />
                </div>
              </div>

              <DialogFooter className="gap-3 sm:gap-0">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/10"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingItem ? 'Update Item' : 'Create Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="md:col-span-6 lg:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Search your dishes..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-12 pl-12 bg-slate-50 border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-2xl font-bold text-xs uppercase tracking-widest focus:bg-white">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
              <SelectItem value="All" className="font-bold text-xs uppercase tracking-widest">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="font-bold text-xs uppercase tracking-widest">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <div className="h-12 px-4 bg-slate-50 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Items</span>
            <span className="text-sm font-black text-indigo-600">{filteredItems.length}</span>
          </div>
        </div>
      </div>

      {/* Menu Items Table/Grid */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dish Info</th>
                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 line-clamp-1 mt-0.5 uppercase tracking-tighter">{item.description || 'No description provided.'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-widest border border-slate-200/50">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-base font-black text-slate-900 tracking-tighter">₹{item.price}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      item.is_available 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    )}>
                      <div className={cn("w-1 h-1 rounded-full", item.is_available ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(item)}
                        className="w-10 h-10 rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all active:scale-90"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                      >
                        {isDeleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UtensilsCrossed className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">No Dishes Found</h3>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;