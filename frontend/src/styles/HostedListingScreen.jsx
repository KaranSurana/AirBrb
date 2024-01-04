import styled from 'styled-components';

// Parent Container Styling
// Responsive Styling
export const Card = styled.div`
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 20%;
  margin: 2.5%;
  height: 420px;
  border-radius: 10px;
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 1050px) {
    margin: 0.6%;
    width: 32%;
    height: 350px;
  }
  @media screen and (max-width: 800px) {
      margin: 4.5%;
      width: 40%;
      height: 450px;
  }
  @media screen and (max-width: 600px) {
    margin: 2%;
    width: 45%;
    height: 450px;
  }
  @media screen and (max-width: 500px) {
    margin: 10.5%;
    width: 75%;
    height: 450px;
  }
`;

export const ImgDiv = styled.div`
  height: 60%;
  overflow: hidden;
  border-radius: 10px;
  @media screen and (max-width: 850px) {
    overflow: hidden;
  }
  @media screen and (max-width: 550px) {
    overflow: hidden;
  }
`;

export const Container = styled.div`
  height: 40%;
  width: 100%;
  padding: 2px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

// Header Styling
export const HostedListingHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HostedListingTitle = styled.h4`
  overflow-wrap: break-word;
`;

export const HostedListingAddress = styled.p`
  font-size: 14px;
  color: #717171;
`;

export const HostedListingInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Icons Styling In Listing Details
export const HostedListingIcons = styled.div`
  width: 40px;
  display: flex;
  justify-content: space-around;
  align-items: baseline;
`;

export const HostedListingIconText = styled.p`
  margin-left: 0.2rem;
  text-align: left;
`;

// Delet icon Styling
export const HostedListingDelete = styled.div`
  position: absolute;
  right: 0;
  font-size: 1.5rem;
  padding: 10px;
  z-index: 2;
  color: rgb(255, 0, 0);
`;

export const HostedListingSeeMore = styled.div`
  position: absolute;
  left: 0;
  font-size: 1rem;
  padding: 10px;
  z-index: 2;
  color: rgb(255, 0, 0);
`;

// All Publish/unpublish/edit buttons styling
export const PublishSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const PublishButton = styled.input`
  width: 100%;
  height: 2.5rem;
  border: none;
  outline: none;
`;

export const PublishSectionPublish = styled(PublishButton)`
  background-color: #FF385C;
  color: white;
  width: 33%;
`;

export const PublishSectionEdit = styled(PublishButton)`
  border-radius: 0px 0px 10px 0px;
  width: 33%;
`;

export const PublishSectionEdit2 = styled(PublishButton)`
  border-radius: 0px 0px 0px 10px;
  width: 33%;
`;

// Thumbnail Image Styling
export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
`;
