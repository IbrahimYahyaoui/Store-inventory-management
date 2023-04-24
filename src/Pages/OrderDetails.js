import { Input, Textarea } from "@nextui-org/react";
import React, { useContext, useEffect, useRef, useState } from "react";

import { db } from "../Config";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
const OrderDetails = () => {
  const { id } = useParams();
  const [cart, setCart] = useState([]);
  const [orderData, setOrderData] = useState();
  const nameRef = useRef();
  const phoneRef = useRef();
  const descriptionRef = useRef();
  // get one product from data base by Id
  const GetOrderById = async () => {
    try {
      const Data = await getDoc(doc(db, "Orders", id));
      setCart(Data.data().cart);
      // setTotalPrice(Data.data().totalPrice);
      setOrderData(Data.data());
      nameRef.current.value = Data.data().name;
      phoneRef.current.value = Data.data().phone;
      descriptionRef.current.value = Data.data().description;
    } catch (e) {
      console.error("Error fetching categories: ", e);
    }
  };
  useEffect(() => {
    GetOrderById();
  }, []);
  console.log(orderData);
  return (
    <div className="flex flex-col ">
      <div className="mx-4 pb-20">
        <h1 className="text-4xl">Orders :</h1>
        <div className="flex flex-col w-60 pb-5">
          <Input label="name : *" ref={nameRef}></Input>
          <Input label="phone Number : * " ref={phoneRef}></Input>
          <Textarea label="description" ref={descriptionRef}></Textarea>
        </div>
        <div className="border p-2">
          {cart &&
            cart.map((item) => {
              return (
                <div className="flex items-center justify-between my-2  scroll">
                  <img src={item.data.ImageList[0]} className="w-16 rounded " />
                  <p className="text-left">{item.data.name} </p>
                  <p className="flex">
                    {Object.values(item.data.selectedOption).map((option) => {
                      return (
                        <p className=" text-xs  md:text-sm mx-3">{option}</p>
                      );
                    })}
                  </p>
                  <p>QTe : {item.data.counter}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
