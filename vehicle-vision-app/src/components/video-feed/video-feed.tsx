import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import {
  AzureResponse,
  MediaProps,
} from "../../interface/media-props.interface";
const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

const response = {
  id: "8e7fef48-dbfe-4abd-ab3f-cfb8148f41bc",
  project: "05f6b2e5-dd5d-4703-a50a-1044b3d7f47a",
  iteration: "74f1ef42-5f0e-4e4d-8af3-873d3abf4f34",
  created: "2021-07-02T12:57:24.509Z",
  predictions: [
    {
      probability: 0.35627556,
      tagId: "c62ceb05-03b6-44e0-b9fd-1670613b8044",
      tagName: "Aston Martin Virage Convertible 2012",
    },
    {
      probability: 0.23506866,
      tagId: "d2aeb568-ee28-47f8-b0d7-824c4e69641e",
      tagName: "Audi R8 Coupe 2012",
    },
    {
      probability: 0.1911441,
      tagId: "f8ff2dc8-fcf4-4144-86db-4823f3bbfbc6",
      tagName: "AM General Hummer SUV 2000",
    },
    {
      probability: 0.07213361,
      tagId: "925ad202-2655-4837-bfd9-3c45ff7c72c8",
      tagName: "Acura TL Type-S 2008",
    },
    {
      probability: 0.03452298,
      tagId: "57c2b13b-d1b6-4b4a-8a7a-0f36ddf78613",
      tagName: "Aston Martin V8 Vantage Coupe 2012",
    },
    {
      probability: 0.028097242,
      tagId: "8d9808c8-4d62-4811-bbb5-f3401839e8af",
      tagName: "Audi RS 4 Convertible 2008",
    },
    {
      probability: 0.018102951,
      tagId: "0bb730d8-0caa-4ab4-918f-d53306a1c52e",
      tagName: "Acura ZDX Hatchback 2012",
    },
    {
      probability: 0.01735906,
      tagId: "7f525387-f78a-459e-b336-2a26bde97011",
      tagName: "Aston Martin V8 Vantage Convertible 2012",
    },
    {
      probability: 0.014167885,
      tagId: "ea2301af-757b-4507-be3d-0f25ad7c7306",
      tagName: "Aston Martin Virage Coupe 2012",
    },
    {
      probability: 0.0094606355,
      tagId: "747e3768-26ee-4e3b-a4fa-ff00ced44139",
      tagName: "Acura TSX Sedan 2012",
    },
    {
      probability: 0.008426548,
      tagId: "5103f975-8b52-4d4e-a5f8-a0a50e4b4226",
      tagName: "Acura Integra Type R 2001",
    },
    {
      probability: 0.0050876476,
      tagId: "a1679c36-f17c-4fa7-98f0-00d0fe0d7cb5",
      tagName: "Audi A5 Coupe 2012",
    },
    {
      probability: 0.0038383366,
      tagId: "92bbb443-127b-4fa4-8935-3ac9f40a3868",
      tagName: "Audi TTS Coupe 2012",
    },
    {
      probability: 0.003788801,
      tagId: "1d8dfcef-9171-49d7-96cb-25821ab317a7",
      tagName: "Acura RL Sedan 2012",
    },
    {
      probability: 0.0025259769,
      tagId: "971690ac-6a7b-416e-af0a-25c5265c8936",
      tagName: "Acura TL Sedan 2012",
    },
  ],
};

const getBinaryFromFile = (file: string) => {
  var BASE64_MARKER = ";base64,";
  var base64Index = file.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = file.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};
export const MediaControlCard: React.FC<MediaProps> = ({ latestImage }) => {
  const classes = useStyles();
  const [predictedData, setPredictedData] = useState<AzureResponse[]>(
    response.predictions
  );

  if (latestImage !== null) {
    const bin = getBinaryFromFile(latestImage);

    axios({
      method: "POST",
      url: "https://vehiclesvisionapi-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/969c11ec-fb9a-4e9e-a239-8ab5721f7232/classify/iterations/Iteration1/image",
      data: bin,
      headers: {
        "Content-Type": "application/octet-stream", // The essential
        "Prediction-Key": "123456789ABCDEF",
      },
    })
      .then((res: any) => {
        console.log(res);
        if (res.status === 200) {
          console.log(res);
          setPredictedData(res.data.predictions);
        } else {
          console.log(res);
        }
      })
      .catch((res: any) => {
        console.log(res);
      });
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>TagName</TableCell>
            <TableCell align="right">Probability</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {predictedData
            .sort((a, b) => 0 - (a > b ? 1 : -1))
            .map((row) => (
              <TableRow key={row.tagId}>
                <TableCell component="th" scope="row">
                  {row.tagName}
                </TableCell>
                <TableCell align="right">{row.probability}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
