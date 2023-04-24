import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import React, { useEffect, useRef, useState } from "react";
import { db } from "../Config";
import { Input, Table } from "@nextui-org/react";
// import { v4 as uuidv4 } from "uuid";
import {
  UilEdit,
  UilTrash,
  UilBackspace,
  UilSearch,
} from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";

const Products = () => {
  //
  const navigate = useNavigate();
  // product list
  const [productsList, setProductsList] = useState();
  // reference to product collection in firebase
  const ProductCollection = collection(db, "products");
  // get All product from firebase
  const GetAllProducts = async () => {
    try {
      const Data = await getDocs(ProductCollection);
      const products = [];
      Data.forEach((doc) => {
        products.push({ data: doc.data(), id: doc.id });
      });
      setProductsList(products);
    } catch (e) {
      console.error("Error fetching categories: ", e);
    }
  };
  // filter the product
  const filterRef = useRef();
  const filterProduct = () => {
    const id = filterRef.current.value.toLowerCase();
    if (id.length > 0) {
      // console.log("s", id);
      setProductsList(
        productsList.filter(
          (product) => product.data.name.toLowerCase().indexOf(id) >= 0
        )
      );
    } else {
      GetAllProducts();
    }
  };

  // delete product
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error removing document: ", e);
    }
    GetAllProducts();
  };
  useEffect(() => {
    GetAllProducts();
  }, []);
  // edit product

  return (
    <div className="p-6 ">
      <p className="my-4 flex items-end">
        <Input
          label="Filter : "
          width="350px"
          ref={filterRef}
          onChange={() => {
            filterProduct();
          }}
          clearable
        />
        <p
          className="px-5 bg-blue-700 h-10 mx-5 flex items-center text-white rounded-xl cursor-pointer"
          // onClick={}
        >
          <UilSearch />
        </p>
      </p>
      <Table aria-label="tabel">
        <Table.Header>
          <Table.Column>Photo</Table.Column>
          <Table.Column>Name</Table.Column>
          <Table.Column>Price</Table.Column>
          <Table.Column>Edit</Table.Column>
          <Table.Column>Stock</Table.Column>
        </Table.Header>
        <Table.Body>
          {productsList &&
            productsList.map((product) => {
              return (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <img
                      src={product.data.ImageList[0]}
                      className="w-24 rounded"
                      alt="product img"
                    />
                  </Table.Cell>
                  <Table.Cell>{product.data.name}</Table.Cell>
                  <Table.Cell>{product.data.price} TND</Table.Cell>
                  <Table.Cell>
                    <div className="flex ">
                      <p
                        className=" cursor-pointer text-green-600"
                        onClick={() => {
                          navigate(`/edit/${product.id}`);
                        }}
                      >
                        {<UilEdit />}
                      </p>
                      <p
                        className=" cursor-pointer text-red-700 mx-2"
                        onClick={() => {
                          deleteProduct(product.id);
                        }}
                      >
                        {<UilTrash />}
                      </p>
                      <p className=" cursor-pointer text-blue-600">
                        {<UilBackspace />}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="flex">availablea</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Products;
