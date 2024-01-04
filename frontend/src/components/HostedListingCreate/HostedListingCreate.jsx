import React, { useState, useEffect } from 'react';
import SuccessPopup from './SuccessPopup';
import LoadingBar from 'react-top-loading-bar'
import {
  FormContainer,
  InnerFormContainer,
  InnerFormLeft,
  InnerFormRight,
  Label,
  Label3,
  Input,
  Button,
  ActualHeader,
} from '../../styles/HostedListingCreate';

// Component
const HostedListingCreate = () => {
  // States Defined Here
  const [progress, setProgress] = useState(0);
  const [successPopup, setSuccessPopup] = useState(false);
  // Setting Progress of loading bar here
  useEffect(() => {
    setProgress(30);
  }, [location.search]);
  useEffect(() => {
    setProgress(100);
  }, []);

  // Actual Data Structure For Creating Listing
  const [formData, setFormData] = useState({
    title: '',
    address: {
      buildingNumber: '',
      streetNumber: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    price: '',
    thumbnail: null,
    youtube: '',
    metadata: {
      propertyType: '',
      bathrooms: '',
      bedrooms: '',
      beds: '',
      amenities: '',
    },
  });

  // Following below is a function to execute when there is a change in the form
  const handleFormDifference = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Following below is a function to execute when there is a change in the form
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };

  // Following below is a function to execute when there is a change in the form
  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        [name]: value,
      },
    });
  };

  // Following below is a function to execute when there is a change in the form
  const handleThumbnailChange = async (e) => {
    const files = e.target.files;

    // List of thumbnails
    const images = [];

    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const dataUrl = await fileToDataUrl(element);
      images[index] = dataUrl;
    }
    setFormData({
      ...formData,
      thumbnail: images,
    });
  };

  // Image to Data URL function used from Assignment 3
  const fileToDataUrl = async (file) => {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    if (!valid) {
      throw Error('provided file is not a png, jpg or jpeg image.');
    }
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  };

  // Common funtion with params to execute backend reuqest where params accept url and data which is to be passed inside the request
  const postData = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('userToken')
        },
        body: JSON.stringify(data), // Convert the data to JSON format
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json(); // Parse the response as JSON
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for the calling code to handle
    }
  };

  // Checking and Validating JSON data uploaded through the form (Advanced Feature)
  const checkJsonInput = async (jsonData) => {
    if (!jsonData.thumbnail) {
      jsonData.thumbnail = [];
    }
    if (jsonData.title && jsonData.address && jsonData.price && jsonData.metadata) {
      await postData('http://localhost:5005/listings/new', jsonData);
      setSuccessPopup(true);
    }
  }

  // Accepting Youtube URL link inside metadata (Advanced Feature)
  const handleYouTubeChange = async (e) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        youtube: e.target.value
      },
    });
  }

  // Parsing and Reading JSON Data Uploaded
  const uploadJson = (e) => {
    const fileInp = e.target.files[0];
    if (fileInp) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          checkJsonInput(jsonData)
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(fileInp);
    }
  };

  // Handling Submission of form
  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData('http://localhost:5005/listings/new', formData);
    setSuccessPopup(true);
  };

  const closePopup = (value) => {
    setSuccessPopup(value);
  };

  // Rendering Component
  return (
  <>
    {/* Loading Bar Setup */}
    <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
    <FormContainer onSubmit={handleSubmit}>
      <ActualHeader>
        <h2>Host A New Listing</h2>
      </ActualHeader>
      {/* Creating Listing Form to Fill */}
      <InnerFormContainer>
        <InnerFormLeft>
          <div>
            <Input
              type="text"
              name="title"
              placeholder='Listing Title'
              required
              value={formData.title}
              onChange={handleFormDifference}
            />
          </div>
          <div>
            <Label>Listing Address</Label>
            <div>
              <Input
                type="number"
                name="buildingNumber"
                placeholder='Building Number'
                required
                value={formData.address.buildingNumber}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Input
                type="text"
                name="streetNumber"
                placeholder='Street Number & Name'
                required
                value={formData.address.streetNumber}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Input
                type="text"
                name="city"
                placeholder='City'
                required
                value={formData.address.city}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Input
                type="text"
                name="state"
                placeholder='State'
                required
                value={formData.address.state}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Input
                type="number"
                name="zipcode"
                placeholder='ZipCode'
                required
                value={formData.address.zipcode}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Input
                type="text"
                name="country"
                placeholder='Country'
                required
                value={formData.address.country}
                onChange={handleAddressChange}
              />
            </div>
          </div>
          <div>
            <Input
              type="number"
              name="price"
              placeholder='Price (Per Night)'
              required
              value={formData.price}
              onChange={handleFormDifference}
            />
          </div>
        </InnerFormLeft>
        <InnerFormRight>
          <div>
            <Label className='imp-mark' htmlFor="thumbnail">Listing Thumbnail (Upload All The Images)</Label>
            <Input data-testid="thumbnail-upload"
              type="file"
              name="thumbnail"
              onChange={handleThumbnailChange}
              required
              multiple
            />
          </div>
          <div>
            <Input
              type="text"
              name="propertyType"
              placeholder='Property Type'
              required
              value={formData.metadata.propertyType}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <Input
              type="number"
              name="bathrooms"
              placeholder='Number of Bathrooms'
              required
              value={formData.metadata.bathrooms}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <Input
              type="number"
              name="bedrooms"
              placeholder='Property Bedrooms'
              required
              value={formData.metadata.bedrooms}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <Input
              type="number"
              name="beds"
              placeholder='Total Property Beds'
              required
              value={formData.metadata.beds}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <Input
              type="text"
              name="amenities"
              placeholder='Property Amenities (Separated By a Comma)'
              required
              value={formData.metadata.amenities}
              onChange={handleMetadataChange}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder='Youtube Video os the Listing'
              onChange={handleYouTubeChange}
            />
          </div>
          <hr />
          <Label3 htmlFor="jsonFile">Upload JSON data</Label3>
          <Input type="file" name="jsonFile" onChange={(e) => { uploadJson(e) }} />
        </InnerFormRight>
      </InnerFormContainer>
      <Button type="submit">Submit</Button>
    </FormContainer>
    {/* Success Popup rendered here */}
    {successPopup ? <SuccessPopup closePopup={closePopup} /> : null}
  </>
  );
};

export default HostedListingCreate;
