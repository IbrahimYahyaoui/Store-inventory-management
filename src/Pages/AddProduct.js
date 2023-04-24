import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, Textarea, Dropdown, Loading } from "@nextui-org/react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../Config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const AddProduct = () => {
  //  the selected value is the value of the dropdown Category
  const [selected, setSelected] = useState(new Set([]));
  const selectedValue = useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );
  // image list to preview and upload
  const [ImageList, setImageList] = useState();
  //   array of image url after upload them to firebase
  const [imageURLs, setImageURLs] = useState([]);
  //option list
  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  //    ref to get data
  const nameRef = useRef();
  const priceRef = useRef();
  const discountRef = useRef();
  const descriptionRef = useRef();
  //  disabeld button while uploading
  const [disabled, setDisabled] = useState(false);
  // Post product to firebase
  const productCollection = collection(db, "products");
  const uploadsImages = async () => {
    setDisabled(true);
    setImageURLs([]);
    for (let i = 0; i < ImageList.length; i++) {
      const image = ImageList[i];
      const storageRef = ref(storage, `images/${uuidv4()}`);
      await uploadBytes(storageRef, image).then(() => {
        console.log("success");
        // get url
        getDownloadURL(storageRef).then((url) => {
          imageURLs.push(url);
          if (imageURLs.length === ImageList.length) {
            AddProducts();
          }
        });
      });
    }
  };
  const AddProducts = async () => {
    const product = {
      name: nameRef.current.value,
      price: priceRef.current.value,
      discount: discountRef.current.value,
      description: descriptionRef.current.value,
      category: Array.from(selected).join(", ").replaceAll("_", " "),
      option1: option1,
      option2: option2,
      option3: option3,
      ImageList: imageURLs,
    };
    try {
      const docRef = await addDoc(productCollection, product);
      console.log("Document written with ID: ", docRef.id);
      setDisabled(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      setDisabled(false);
    }
  };
  // fetch category from firebase
  const CategoryCollection = collection(db, "Category");

  const [CategoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const Data = await getDocs(CategoryCollection);
        const categories = [];
        Data.forEach((doc) => {
          categories.push({ data: doc.data().name, id: doc.id });
        });
        setCategoryList(categories);
        console.log(categories);
      } catch (e) {
        console.error("Error fetching categories: ", e);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div className="grid  place-content-center ">
      <p className="text-center uppercase font-bold my-8">add product</p>
      <div className="border-2 rounded-2xl p-5 ">
        {/* name , price , discount */}
        <section>
          <section className="flex justify-between  ">
            <div className="mx-6">
              <Input clearable label="Full Name" ref={nameRef} />
            </div>
            <div className="mx-6">
              <Input clearable label="Price" ref={priceRef} />
            </div>
            <div className="mx-6">
              <Input clearable label="discount" ref={discountRef} />
            </div>
          </section>
          {/* description and select category */}
          <section className="flex items-center">
            <div className="mx-6">
              <Textarea
                label="description"
                css={{ w: 350 }}
                ref={descriptionRef}
              />
            </div>
            <div>
              <Dropdown>
                <Dropdown.Button
                  flat
                  color="primary"
                  css={{ tt: "capitalize" }}
                  label="Category"
                >
                  category :{selectedValue}
                </Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Multiple selection actions"
                  color="primary"
                  disallowEmptySelection
                  selectionMode="multiple"
                  selectedKeys={selected}
                  onSelectionChange={setSelected}
                >
                  {CategoryList.map((category) => (
                    <Dropdown.Item key={category.data}>
                      {category.data}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </section>
          {/* option */}
          <section className="flex justify-between">
            <div className="mx-6">
              <Input
                label="option 1"
                onChange={(e) => {
                  setOption1(e.target.value.split("#"));
                }}
              />
            </div>
            <div className="mx-6">
              <Input
                label="option 2"
                onChange={(e) => {
                  setOption2(e.target.value.split("#"));
                }}
              />
            </div>
            <div className="mx-6">
              <Input
                label="option 3"
                onChange={(e) => {
                  setOption3(e.target.value.split("#"));
                }}
              />
            </div>
          </section>

          {/* image section */}
          <section className="m-6 flex  items-center">
            <label
              htmlFor="file-input"
              className="p-2  bg-blue-400 rounded h-10 mr-6"
            >
              choose images
            </label>
            <input
              type="file"
              id="file-input"
              name="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files.length > 3) {
                  console.log("longer than 3");
                } else {
                  setImageList(e.target.files);
                }
              }}
            />
            {/* image-preview  */}
            <div className="flex">
              {ImageList &&
                Array.from(ImageList).map((image) => (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="a"
                    className="	w-16 m-2 rounded outline outline-offset-2"
                    key={uuidv4()}
                  />
                ))}
            </div>
          </section>

          {
            // tenary if
            !disabled ? (
              <p
                className="border w-32 text-center m-auto bg-black py-2 text-white rounded cursor-pointer"
                onClick={() => {
                  uploadsImages();
                }}
              >
                Add product
              </p>
            ) : (
              <p className="border w-32 text-center m-auto bg-black py-2 text-white rounded cursor-pointer">
                <Loading type="points" size="xl" color={"white"} />
              </p>
            )
          }
        </section>
      </div>
    </div>
  );
};

export default AddProduct;
