"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, FileText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useGlobalState } from './contexts/global-state';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface Product {
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  _id: string;
}

interface ApiProduct {
  productname: string;
  price: number;
  quantity: number;
  _id: string;
}

interface NewProduct {
  name: string;
  price: string;
  quantity: string;
}

interface SortConfig {
  key: keyof Product;
  direction: 'asc' | 'desc';
}

const ProductManagement: React.FC = () => {
  const router = useRouter();
  const {setIsLoading} = useGlobalState();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    quantity: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('https://levitation.api.corevision.live/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(response);

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
        }

        const data: ApiProduct[] = await response.json();
        
        // Map API response to Product interface
        const mappedProducts: Product[] = data.map(item => ({
          name: item.productname,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          _id: item._id
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // You might want to add error handling UI here
      }
    };

    fetchProducts();
  }, [router]);


  const handleAddProduct = async (): Promise<void> => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      const price = Number(newProduct.price);
      const quantity = Number(newProduct.quantity);

      try{
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
      const response = await fetch('https://levitation.api.corevision.live/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productname: newProduct.name,
          price: price, 
          quantity: quantity
        }),
      });

      if(response.ok){
        const productToAdd: Product = {
          name: newProduct.name,
          price,
          quantity,
          totalPrice: price * quantity,
          _id: Date.now().toString() // Temporary ID until API integration for adding products
        };
  
        setProducts(prevProducts => [...prevProducts, productToAdd]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }catch(error){
        toast({
          title: "Error adding new Product",
          description: "Please try again later"
        })
      }finally{
        setIsLoading(false);
      }
      
      
      setNewProduct({ name: '', price: '', quantity: '' });
    }
  };
  

  // Rest of your existing code remains the same
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewProduct
  ): void => {
    setNewProduct(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const calculateSubtotal = (): number => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const calculateGST = (): number => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateGST();
  };

  const handleSort = (key: keyof Product): void => {
    setSortConfig(prevConfig => ({
      key,
      direction: 
        prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }));

    const sortedProducts = [...products].sort((a, b) => {
      if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
  };

  const generatePDFInvoice = async (): Promise<void> => {
    try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.request({
          method: 'get',
          url: 'http://localhost:4000/api/generate-invoice',
          headers: {
              'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer'
      });
      console.log(response);
      console.log(response.data);

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      console.log(downloadUrl);
        if (response.data) {
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `invoice_${Date.now()}.pdf`;
                document.body.appendChild(link);
                link.click();
        } else {
            toast({
              title: "Unable to generate invoice",
              description: "Try again later."
            });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "There was an issue generating the PDF. Please try again later."
        });
        console.error('Error generating PDF:', error);
    } finally {
        setIsLoading(false);
    }
};

  function logout(){
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="fixed top-14 bottom-0 right-0 left-0 overflow-auto bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
      <div className=" fixed top-0 right-0 left-0 h-14 bg-zinc-800 flex justify-between items-center pl-[5vw] pr-[5vw]">
            <h1 className=" text-white">Levitation</h1>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={logout}>
                Logout
            </Button>
        </div>

        <div>
          <CardHeader>
            <CardTitle className="text-2xl">Add Products</CardTitle>
            <p className="text-sm text-gray-400">
              This is basic login page which is used for levitation assignment purpose.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">Product Name</label>
                <Input
                  placeholder="Enter the product name"
                  className="bg-zinc-600 border-zinc-500"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Product Price</label>
                <Input
                  type="number"
                  placeholder="Enter the price"
                  className="bg-zinc-600 border-zinc-500"
                  value={newProduct.price}
                  onChange={(e) => handleInputChange(e, 'price')}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Quantity</label>
                <Input
                  type="number"
                  placeholder="Enter the Qty"
                  className="bg-zinc-600 border-zinc-500"
                  value={newProduct.quantity}
                  onChange={(e) => handleInputChange(e, 'quantity')}
                />
              </div>
            </div>

            <Button
              onClick={handleAddProduct}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Add Product
            </Button>

            <div className="mt-8">
              <Table>
                <TableHeader className=' bg-white text-black'>
                  <TableRow className=' text-black'>
                    <TableHead
                      className="text-white cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <p className=' text-black'>Product name 
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' 
                          ? <ArrowUpIcon className="inline w-4 h-4 ml-1" />
                          : <ArrowDownIcon className="inline w-4 h-4 ml-1" />
                      )}</p>
                    </TableHead>
                    <TableHead 
                      className="text-white cursor-pointer"
                      onClick={() => handleSort('quantity')}
                    >
                      <p className=' text-black'>
                      Quantity
                      {sortConfig.key === 'quantity' && (
                        sortConfig.direction === 'asc' 
                          ? <ArrowUpIcon className="inline w-4 h-4 ml-1" />
                          : <ArrowDownIcon className="inline w-4 h-4 ml-1" />
                      )}
                      </p>
                    </TableHead>
                    <TableHead 
                      className="text-white cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      <p className=' text-black'>
                      Price
                      {sortConfig.key === 'price' && (
                        sortConfig.direction === 'asc' 
                          ? <ArrowUpIcon className="inline w-4 h-4 ml-1" />
                          : <ArrowDownIcon className="inline w-4 h-4 ml-1" />
                      )}
                      </p>
                    </TableHead>
                    <TableHead className="text-white">Total Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow className=' hover:bg-transparent' key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>INR {product.totalPrice}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className=' hover:bg-transparent'>
                    <TableCell colSpan={3} className="text-right">+GST 18%</TableCell>
                    <TableCell>INR {calculateGST().toFixed(1)}</TableCell>
                  </TableRow>
                  <TableRow className=' hover:bg-transparent'>
                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                    <TableCell className="font-bold">INR {calculateTotal().toFixed(1)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex justify-center">
              <Button 
                className="bg-gray-800 hover:bg-gray-700"
                onClick={generatePDFInvoice}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF Invoice
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;