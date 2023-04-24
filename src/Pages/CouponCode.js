//
// this is a page for add and delete coupon code from firebase
// you might see Category every where in this page but it's just
//  that it have the same function as category code
// and this project done in 2 days so i didn't have time to change it
//  or put stuff like context api or redux
// or event optimize the code
//

import { Input } from "@nextui-org/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Config";
const CouponCode = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState();
  // add category to firebase
  const CategoryCollection = collection(db, "coupon");

  const addCategory = async () => {
    try {
      const docRef = await addDoc(CategoryCollection, {
        name: category,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    fetchCategory();
  };
  // fetch all categories from firebase
  const fetchCategory = async () => {
    try {
      const Data = await getDocs(CategoryCollection);
      const categories = [];
      Data.forEach((doc) => {
        categories.push({ data: doc.data().name, id: doc.id });
      });
      setCategoryList(categories);
    } catch (e) {
      console.error("Error fetching categories: ", e);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  console.log(categoryList);
  //  delete one category by id from firebase when click an button
  const deleteCategory = async (id) => {
    console.log(id);
    try {
      await deleteDoc(doc(db, "Category", id));
      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error removing document: ", e);
    }
    fetchCategory();
  };

  return (
    <div>
      <div className="grid  place-content-center ">
        <p className="text-center uppercase font-bold my-8">Category</p>
        <div className="border-2 rounded-2xl p-5 flex flex-col items-center">
          <div className="flex items-end ">
            <Input
              label="coupon"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            />
            <button
              className="bg-blue-400 text-white rounded-2xl px-4 py-2 h-10 mx-4"
              onClick={() => addCategory()}
            >
              add
            </button>
          </div>

          <section className="container columns-3 mt-6">
            <div>
              {categoryList.map((cat) => (
                <p
                  className="border-2 rounded-2xl p-5  h-8  flex items-center justify-between mb-2 "
                  key={cat.id}
                >
                  <p>{cat.data}</p>
                  <button
                    className=" text-white bg-black rounded-2xl  border h-8 w-8  mx-4"
                    onClick={() => {
                      deleteCategory(cat.id);
                    }}
                  >
                    X
                  </button>
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CouponCode;
