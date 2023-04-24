import { Input } from "@nextui-org/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, storage } from "../Config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Category = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState();
  const [categoryPicture, setCategoryPicture] = useState();
  // add category to firebase
  const CategoryCollection = collection(db, "Category");

  const addCategory = async (url) => {
    try {
      const docRef = await addDoc(CategoryCollection, {
        name: category,
        categoryPicture: url,
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
        categories.push({
          data: doc.data().name,
          id: doc.id,
          url: doc.data().categoryPicture,
        });
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

  const uploadsCategory = async () => {
    const storageRef = ref(storage, `CategoryImages/${uuidv4()}`);

    await uploadBytes(storageRef, categoryPicture).then(() => {
      console.log("success");
      // get url
      getDownloadURL(storageRef).then(async (url) => {
        await addCategory(url);
      });
    });
  };

  return (
    <div>
      <div className="grid  place-content-center ">
        <p className="text-center uppercase font-bold my-8">Category</p>
        <div className="border-2 rounded-2xl p-5 flex flex-col items-center">
          <div className="flex flex-col ">
            <div className="flex items-end">
              <Input
                label="category"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
              <button
                className="bg-blue-400 text-white rounded-2xl px-4 py-2 h-10 mx-4"
                onClick={() => uploadsCategory()}
              >
                add
              </button>
            </div>
            <div className="p-4 flex items-center ">
              <label
                to="catPic"
                className="border p-2 bg-slate-500 rounded text-white"
              >
                Category Picture
                <input
                  type="file"
                  id="catPic"
                  className=" hidden"
                  onChange={(e) => {
                    setCategoryPicture(e.target.files[0]);
                  }}
                ></input>
              </label>
              {/* preview the image */}
              <div className="flex items-center justify-center m-2">
                {categoryPicture && (
                  <img
                    src={URL.createObjectURL(categoryPicture)}
                    alt="category"
                    className="w-20 h-20"
                  />
                )}
              </div>
            </div>

            <section className="  ">
              <div className="grid grid-cols-8  ">
                {categoryList.map((cat) => (
                  <div
                    className="border-2 rounded-2xl p-5  w-24  flex items-center justify-center mb-2  mx-2"
                    key={cat.id}
                  >
                    <div>
                      <img src={cat.url} />
                      <div>
                        <p>{cat.data}</p>
                        <button
                          className=" text-white bg-black rounded-2xl  border h-8 w-8  mx-4"
                          onClick={() => {
                            deleteCategory(cat.id);
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
