import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Config";
import { Link } from "react-router-dom";

const Orders = () => {
  const [timePassed, setTimePassed] = useState("");

  const calculateTIMEAgo = (X) => {
    const targetDate = new Date(X).getTime();
    const now = Date.now();
    const timeDiff = now - targetDate;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // setTimePassed(`${days}d ${hours}h ${minutes}m `);
    return `${days}d ${hours}h ${minutes}m `;
  };
  const [orderList, setOrderList] = useState([]);
  const ProductCollection = collection(db, "Orders");
  // get All product from firebase
  const GetAllOrders = async () => {
    try {
      const Data = await getDocs(ProductCollection);
      const products = [];
      Data.forEach((doc) => {
        products.push({ data: doc.data(), id: doc.id });
      });
      setOrderList(products);
    } catch (e) {
      console.error("Error fetching categories: ", e);
    }
  };
  useEffect(() => {
    GetAllOrders();
  }, []);
  // sort order by date
  // orderList.sort((a, b) => {
  //   return new Date(b.data.date) - new Date(a.data.date);
  // });

  console.log(orderList);
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl  uppercase font-bold my-10">Orders</h1>
      <div className="grid grid-cols-2 ">
        {orderList.map((order) => (
          <Link
            to={`/ordersDetails/${order.id}`}
            key={order.id}
            className="flex border w-72 p-4 m-2 justify-between rounded-xl"
          >
            <p className="font-bold">{order.data.name}</p>
            <p className="font-bold">{order.data.totalPrice} DT</p>
            <div className="border bg-black rounded text-white px-1 ">
              {calculateTIMEAgo(order.data.date)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
