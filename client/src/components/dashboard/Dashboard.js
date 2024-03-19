import React from 'react';
import ThreeContainer from '../ThreeComponents/ThreeContainer';
import AddProductForm from '../dashboard/AddProductForm';
import ProductList from '../dashboard/ProductList';

const Dashboard = () => {
  return (
    <div>
      <ThreeContainer />
      <AddProductForm />
      <ProductList />
      {/* Other dashboard-related components */}
    </div>
  );
};

export default Dashboard;
