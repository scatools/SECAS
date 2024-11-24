import React, { useCallback } from "react";
import Dropzone from "react-dropzone";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoader, input_aoi, getCurrentData } from "../action";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import shp from "shpjs";
import { v4 as uuid } from "uuid";

const AddZip = ({ setAlerttext, setView, resetButton, setProgress, setShowProgress }) => {
  const dispatch = useDispatch();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (
        geometry,
        geometryType,
        aoiNumber
      ) => {
        setAlerttext(false);
        setShowProgress(true);
        setProgress(10);
        // Coordinates must be a single array for the area to be correctly calculated
        const newList = geometry.coordinates.map((coordinates) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: geometryType,
            coordinates: [coordinates],
          },
        }));
        // console.log(newList);
        const planArea = calculateArea(newList);
        const data = geometry;

        let currentData;
        let futureData;

        try {
          await getCurrentData(data).then((result) => {
            console.log(result);
            currentData = result;
          });
        } catch (error){
          console.log(error);
        };

        dispatch(
          input_aoi({
            name: "Area of Interest " + aoiNumber,
            geometry: newList,
            area: planArea,
            currentHexagons: currentData,
            futureHexagons: currentData,
            id: uuid(),
          })
        );

        setView("evaluate");
        setProgress(25);
      };

      for (let file of acceptedFiles) {
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await shp(reader.result);
          if (result) {
            // console.log(result.features);
            // Features are stored as [0:{}, 1:{}, 2:{}, ...]
            console.log(result);
            console.log(result.features);
            const featureCollection = result.length > 0 ? result[0] : result;
            for (var num in featureCollection.features) {
              var featureGeometry = featureCollection.features[num].geometry;
              var featureGeometryType = featureCollection.features[num].geometry.type;
              var featureNumber = parseInt(num) + 1;
              var featureName = null;
              // Check if each feature has a name-like property
              // for (var property in result.features[num].properties) {
              //   if (
              //     property.indexOf("name") != -1 ||
              //     property.indexOf("Name") != -1 ||
              //     property.indexOf("NAME") != -1
              //   ) {
              //     featureName = result.features[num].properties[property];
              //   }
              // }
              // Add geometry type as a parameter to cater to both Polygon and MultiPolygon
              handleSubmitShapefile(
                featureGeometry,
                featureGeometryType,
                featureNumber,
                featureName
              );
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [dispatch]
  );

  return (
    <div style={{padding: "20px"}}>
      <p style={{fontSize: "1em"}}>
        Please zip all files (.shp, .shx, .dbf, .prj) of your shapefile into a single zip file and upload from the drop zone below:
      </p>
      <Container className="m-auto file-drop">
        <Dropzone onDrop={onDrop} accept={{ "application/zip": [".zip"] }}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              Click me to upload a zipped shapefile!
            </div>
          )}
        </Dropzone>
      </Container>
    </div>
  );
};

export default AddZip;
