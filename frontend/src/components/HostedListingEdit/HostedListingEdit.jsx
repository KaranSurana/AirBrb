import React, { useEffect, useState } from 'react';
import SuccessPopup from '../HostedListingCreate/SuccessPopup';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FormContainer,
  InnerFormContainer,
  InnerFormLeft,
  InnerFormRight,
  Label,
  Input,
  ActualHeader,
  ImgName,
  Button2,
  ImgDelete,
  FlexAllImg,
  FlexImg,
  Label2,
  Input2,
  Button3
} from '../../styles/HostedListingCreate';
import LoadingBar from 'react-top-loading-bar'

// Component
const HostedListingEdit = () => {
  const navigate = useNavigate();
  // States Defined Here
  const [successPopup, setSuccessPopup] = useState(false);
  const [publishedStatus, setpublishedStatus] = useState(false);
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
    thumbnail: [],
    metadata: {
      propertyType: '',
      bathrooms: '',
      bedrooms: '',
      beds: '',
      amenities: ''
    }
  });
  // Getting ID from URL
  const { id } = useParams();

  useEffect(() => {
    // Getting the details of the current listing and filling the form with it
    async function fetchData () {
      try {
        const response = await fetch(`http://localhost:5005/listings/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setpublishedStatus(data.listing.published);
        // Setting form data
        setFormData({
          title: data.listing.title,
          address: {
            buildingNumber: data.listing.address.buildingNumber,
            streetNumber: data.listing.address.streetNumber,
            city: data.listing.address.city,
            state: data.listing.address.state,
            zipcode: data.listing.address.zipcode,
            country: data.listing.address.country,
          },
          price: data.listing.price,
          thumbnail: data.listing.thumbnail,
          metadata: {
            propertyType: data.listing.metadata.propertyType,
            bathrooms: data.listing.metadata.bathrooms,
            bedrooms: data.listing.metadata.bedrooms,
            beds: data.listing.metadata.beds,
            amenities: data.listing.metadata.amenities,
            youtube: data.listing.metadata.youtube
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function fileToDataUrl (file) {
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
  }

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
    const images = [];

    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const dataUrl = await fileToDataUrl(element);
      images[index] = dataUrl;
    }
    setFormData({
      ...formData,
      thumbnail: [...formData.thumbnail, ...images],
    });
  };

  // Common funtion with params to execute backend reuqest where params accept url and data which is to be passed inside the request
  async function postData (url, data) {
    try {
      let response;
      if (data !== null) {
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('userToken')
          },
          body: JSON.stringify(data), // Convert the data to JSON format
        });
      } else {
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('userToken')
          }
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json(); // Parse the response as JSON
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const deletePic = async (index) => {
    const updatedThumbnail = [...formData.thumbnail];
    updatedThumbnail.splice(index, 1);
    await setFormData({
      ...formData,
      thumbnail: updatedThumbnail
    });
  }

  // updating listing details function
  const updateListingDetails = (navigates = true) => {
    postData('http://localhost:5005/listings/' + id, formData);
    if (navigates) {
      navigate('/hosted-listings');
    }
  }

  // Unpublishing the listing
  const unpublishListing = () => {
    postData('http://localhost:5005/listings/unpublish/' + id, null);
    navigate('/hosted-listings');
  }

  const handleYouTubeChange = async (e) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        youtube: e.target.value
      },
    });
  }

  // Handling the submission of form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate == null || endDate == null) {
      alert('Please Update Availability!');
      return;
    }
    updateListingDetails(false);
    // Getting availability through form and updating in the backend as an array
    const availabilityArr = []
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    if (startDate > lastDate) {
      alert('Invalid Starting & Ending Date');
    } else {
      /* eslint-disable no-unmodified-loop-condition */
      while (currentDate <= lastDate) {
        availabilityArr.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      /* eslint-enable no-unmodified-loop-condition */
    }
    const availability = {
      availability: availabilityArr
    }
    postData('http://localhost:5005/listings/publish/' + id, availability);
    setSuccessPopup(true);
  };
  const closePopup = (value) => {
    setSuccessPopup(value);
    navigate('/hosted-listings');
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(30);
  }, [location.search]);
  useEffect(() => {
    setProgress(100);
  }, []);

  // Component Rendered here
  return (
    <>
      {/* Loading Bar Setup */}
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      <FormContainer onSubmit={handleSubmit}>
        <ActualHeader>
          <h2>Host A New Listing</h2>
        </ActualHeader>
        {/* Listing Form to Edit to update the listing */}
        <InnerFormContainer>
          <InnerFormLeft>
            <div>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder='Listing Title'
                value={formData.title}
                onChange={handleFormDifference}
              />
            </div>
            <div>
              <Label>Listing Address</Label>
              <div>
                <Input
                  type="text"
                  id="buildingNumber"
                  name="buildingNumber"
                  placeholder='Building Number'
                  value={formData.address.buildingNumber}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Input
                  type="text"
                  id="streetNumber"
                  name="streetNumber"
                  placeholder='Street Number & Name'
                  value={formData.address.streetNumber}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder='City'
                  value={formData.address.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  placeholder='State'
                  value={formData.address.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  placeholder='ZipCode'
                  value={formData.address.zipcode}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  placeholder='Country'
                  value={formData.address.country}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            <div>
              <Input
                type="text"
                id="price"
                name="price"
                placeholder='Price (Per Night)'
                value={formData.price}
                onChange={handleFormDifference}
              />
            </div>
          </InnerFormLeft>
          <InnerFormRight>
            <div>
              <Label2 className='imp-mark' htmlFor="thumbnail">Listing Thumbnail (Upload All The Images)</Label2>
              <Input2
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleThumbnailChange}
                required
                multiple
              />
            </div>
            <FlexAllImg>
              {formData.thumbnail && formData.thumbnail.map((element, index) => (
                <FlexImg key={index}>
                  <ImgName>Uploaded Image {index + 1}</ImgName>
                  <ImgDelete onClick={() => deletePic(element.index)} className="fa-solid fa-x"></ImgDelete>
                </FlexImg>
              ))}
            </FlexAllImg>
            <div>
              <Input
                type="text"
                id="propertyType"
                name="propertyType"
                placeholder='Property Type'
                value={formData.metadata.propertyType}
                onChange={handleMetadataChange}
              />
            </div>
            <div>
              <Input
                type="number"
                id="bathrooms"
                name="bathrooms"
                placeholder='Number of Bathrooms'
                value={formData.metadata.bathrooms}
                onChange={handleMetadataChange}
              />
            </div>
            <div>
              <Input
                type="number"
                id="bedrooms"
                name="bedrooms"
                placeholder='Property Bedrooms'
                value={formData.metadata.bedrooms}
                onChange={handleMetadataChange}
              />
            </div>
            <div>
              <Input
                type="number"
                id="beds"
                name="beds"
                placeholder='Total Property Beds'
                value={formData.metadata.beds}
                onChange={handleMetadataChange}
              />
            </div>
            <div>
              <Input
                type="text"
                id="amenities"
                name="amenities"
                placeholder='Property Amenities (Separated By a Comma(,))'
                value={formData.metadata.amenities}
                onChange={handleMetadataChange}
              />
            </div>
            <div>
            <Input
              type="text"
              placeholder='Youtube Video os the Listing'
              value={formData.metadata.youtube}
              onChange={handleYouTubeChange}
            />
          </div>
            <div>
              <label>Set Your Availability</label>
              <Input data-testid="check-input" type="date" onChange={handleStartDateChange} name="start-date" className="start-date" />
              <Input data-testid="check-output" type="date" onChange={handleEndDateChange} name="end-date" className="end-date" />
            </div>
            <div>
            </div>
            </InnerFormRight>
            </InnerFormContainer>
        <div className='save-details-section'>
          <Button2 className='save-details-btn' type="button" onClick={updateListingDetails}>Save Details</Button2>
          {!publishedStatus
            ? (
                <Button3 type="button" onClick={handleSubmit}>Publish</Button3>
              )
            : (
                <Button3 type="button" onClick={unpublishListing}>Unpublish</Button3>
              )}
        </div>
        </FormContainer>
      {/* Success Popup rendered here */}
      {successPopup ? <SuccessPopup closePopup={closePopup} /> : null}
    </>
  );
};

export default HostedListingEdit;
