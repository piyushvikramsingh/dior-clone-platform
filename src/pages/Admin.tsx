import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Package, ShoppingBag, X, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'products' | 'orders' | 'categories';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/');
  }, [loading, user, isAdmin, navigate]);

  // Products
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: isAdmin,
  });

  // Orders
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: isAdmin,
  });

  // Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      return data ?? [];
    },
    enabled: isAdmin,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  // Product form
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', compare_at_price: '', category: '',
    images: '', sizes: '', colors: '', in_stock: true, featured: false,
  });

  const resetForm = () => {
    setProductForm({ name: '', description: '', price: '', compare_at_price: '', category: '', images: '', sizes: '', colors: '', in_stock: true, featured: false });
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEditForm = (product: any) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
      category: product.category,
      images: (product.images || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      in_stock: product.in_stock,
      featured: product.featured,
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const saveProduct = useMutation({
    mutationFn: async () => {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price) || 0,
        compare_at_price: productForm.compare_at_price ? parseFloat(productForm.compare_at_price) : null,
        category: productForm.category,
        images: productForm.images.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: productForm.sizes ? productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean) : null,
        colors: productForm.colors ? productForm.colors.split(',').map((s) => s.trim()).filter(Boolean) : null,
        in_stock: productForm.in_stock,
        featured: productForm.featured,
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: editingProduct ? 'Product updated' : 'Product created' });
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product deleted' });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order updated' });
    },
  });

  if (loading || !isAdmin) return null;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-display text-xl tracking-[0.1em] uppercase">MAISON Admin</h1>
          </div>
          <Link to="/account" className="text-xs font-body text-muted-foreground hover:text-foreground">
            Account
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-border p-4">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">Products</p>
            <p className="font-display text-2xl mt-1">{products.length}</p>
          </div>
          <div className="border border-border p-4">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">Orders</p>
            <p className="font-display text-2xl mt-1">{orders.length}</p>
          </div>
          <div className="border border-border p-4">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">Revenue</p>
            <p className="font-display text-2xl mt-1">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</p>
          </div>
          <div className="border border-border p-4">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">In Stock</p>
            <p className="font-display text-2xl mt-1">{products.filter((p) => p.in_stock).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-border mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-3 text-xs font-body tracking-[0.15em] uppercase border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl">Products</h2>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs font-body tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
                <div className="bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-xl">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                    <button onClick={resetForm}><X size={18} /></button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); saveProduct.mutate(); }} className="space-y-4">
                    <div>
                      <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Name *</label>
                      <Input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Description</label>
                      <textarea
                        className="w-full border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                        value={productForm.description}
                        onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Price *</label>
                        <Input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Compare At</label>
                        <Input type="number" step="0.01" value={productForm.compare_at_price} onChange={(e) => setProductForm((p) => ({ ...p, compare_at_price: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Category</label>
                      <Input value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Image URLs (comma-separated)</label>
                      <Input value={productForm.images} onChange={(e) => setProductForm((p) => ({ ...p, images: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Sizes (comma-sep)</label>
                        <Input placeholder="S, M, L, XL" value={productForm.sizes} onChange={(e) => setProductForm((p) => ({ ...p, sizes: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs font-body tracking-[0.15em] uppercase block mb-1">Colors (comma-sep)</label>
                        <Input placeholder="Black, White" value={productForm.colors} onChange={(e) => setProductForm((p) => ({ ...p, colors: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-xs font-body">
                        <input type="checkbox" checked={productForm.in_stock} onChange={(e) => setProductForm((p) => ({ ...p, in_stock: e.target.checked }))} />
                        In Stock
                      </label>
                      <label className="flex items-center gap-2 text-xs font-body">
                        <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm((p) => ({ ...p, featured: e.target.checked }))} />
                        Featured
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={saveProduct.isPending}
                      className="w-full bg-foreground text-background py-3 text-xs font-body tracking-[0.2em] uppercase hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> {saveProduct.isPending ? 'Saving...' : 'Save Product'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="border border-border p-4 flex items-center gap-4">
                  <div className="w-14 h-18 bg-secondary flex-shrink-0 overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-body truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category} · {formatPrice(product.price)}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.featured && <span className="text-[10px] px-2 py-0.5 bg-secondary">Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditForm(product)} className="p-2 hover:bg-secondary transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => deleteProduct.mutate(product.id)} className="p-2 hover:bg-destructive/10 text-destructive transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No products yet. Add your first product.</p>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-display text-2xl mb-6">Orders</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-body text-muted-foreground">
                      #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value })}
                      className="text-xs font-body border border-border bg-background px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-body text-muted-foreground">{order.email}</span>
                    <span className="font-display text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No orders yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
