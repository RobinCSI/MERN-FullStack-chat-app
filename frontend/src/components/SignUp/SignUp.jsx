import React, { useState } from "react";

import styles from "./SignUp.module.css";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pic, setPic] = useState(); //for adding the pic, we will use cloudinary
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function postDetails(pics) {
    setLoading(true);
    if (pics == undefined) {
      toast({
        title: "No image",
        description: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type == "image/jpeg" || pics.type == "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat app");
      data.append("cloud_name", "dyu4smkc5");
      fetch("https://api.cloudinary.com/v1_1/dyu4smkc5/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Not an image",
        description: "Please select an image type file",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }

  async function handleFormSubmit() {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Details missing",
        description: "Please fill all the details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password != confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please fill the same password",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration successful",
        description: "All the details entered",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chatPage");
    } catch (error) {
      toast({
        title: "Error occurred",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name: </FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password:</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Upload pic</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        w="100%"
        mt="15"
        onClick={handleFormSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
