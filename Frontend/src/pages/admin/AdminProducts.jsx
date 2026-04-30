import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import AdminProductDetails from '@/components/AdminProductDetails'
import ProductSearch from '@/components/ProductSearch'
import ProductFilter from '@/components/ProductFilter'
import { API_URL } from '@/config'

const AdminProducts = () => {
  const { products } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/get-products`);
      if (res.data.success) {
        dispatch(setProducts(res.data.products))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching products. Please try again.");
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  
    useEffect(() => {
      let result = [...products];
      if (searchValue.trim() !== "") {
        const query = searchValue.toLowerCase();
        result = result.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
      }
  
      if (sortBy === "lowToHigh") {
        result.sort((a, b) => a.basePrice - b.basePrice);
      }
      else if (sortBy === "highToLow") {
        result.sort((a, b) => b.basePrice - a.basePrice);
      }
  
      setFilteredProducts(result);
    }, [searchValue, products, sortBy]);
  return (
    <div className="w-full max-w-7xl mx-auto pt-6">
      <h1 className="text-4xl text-primary font-bold font-display mb-6">Product Management</h1>
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-10">
            <div className="w-full md:w-auto flex-1 max-w-md mb-2">
              <ProductSearch searchValue={searchValue} setSearchValue={setSearchValue} />
            </div>
            <div className="w-full md:w-auto mb-2">
              <ProductFilter setSortBy={setSortBy} />
            </div>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
        <AdminProductDetails key={product._id} details={product} />
      ))}
      </div>
    </div>
  )
}

export default AdminProducts
