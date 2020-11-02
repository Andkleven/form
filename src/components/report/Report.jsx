import React from "react";
import query from "graphql/query";
import { useQuery } from "react-apollo";
import { objectifyQuery } from "functions/general";
import {
  Page,
  Text,
  View,
  Document,
  Font,
  PDFViewer,
  PDFDownloadLink
} from "@react-pdf/renderer";
import { Button } from "react-bootstrap";
import Loading from "components/Loading";
import moment from "moment";
import Math from "components/form/functions/math";

/**
 * For development, set the line...
 *
 * const [show, setShow] = useState(false);
 *
 * ...in ReportButton.jsx to true for the item you want to test.
 *
 * Example:
 *
 * const [show, setShow] = useState(item.itemId === "15400");
 */

const fontsize = 7.5;

const time = string =>
  typeof string === "string" && moment(string).format("DD.MM.YYYY HH:mm");
const date = string =>
  typeof string === "string" && moment(string).format("DD.MM.YYYY");

const readyForRender = (project, description, item) => {
  const p = project && project.data;
  const d = description && description.data;
  const i = item;

  return p && d && i;
};

export const Report = ({ project, description, item }) => {
  // registerFonts();

  if (readyForRender(project, description, item)) {
    try {
      return (
        <Document
          title="Report"
          author="Trelleborg Offshore Norway AS"
          creator="Trelleborg Offshore Norway AS"
          producer="Trelleborg Offshore Norway AS"
          subject="Coating Report"
          keywords="coating report trelleborg offshore norway as"
        >
          <Content project={project} description={description} item={item} />
        </Document>
      );
    } catch (error) {
      console.log(error);
    }
  }

  return null;
};

export const Reports = ({ project, filter = "", ...props }) => {
  // registerFonts();

  if (!!project) {
    try {
      return (
        <Document
          title="Report"
          author="Trelleborg Offshore Norway AS"
          creator="Trelleborg Offshore Norway AS"
          producer="Trelleborg Offshore Norway AS"
          subject="Coating Report"
          keywords="coating report trelleborg offshore norway as"
        >
          {project.descriptions.map((description, descriptionIndex) => {
            return description.items.map((item, itemIndex) => {
              let passed = false;
              switch (filter) {
                case "":
                  passed = true;
                  break;

                case "done":
                  if (item.stage === "done") {
                    passed = true;
                  }
                  break;

                default:
                  break;
              }

              if (passed) {
                return (
                  <Content
                    key={`content-description-${descriptionIndex}-item-${itemIndex}`}
                    project={project}
                    description={description}
                    item={item}
                  />
                );
              }
            });
          })}
        </Document>
      );
    } catch (error) {
      console.log(error);
    }
  }

  return null;
};

const Content = ({ project, description, item }) => {
  const p = project && project.data;
  const d = description && description.data;
  const i = item && objectifyQuery(item);

  console.log(JSON.stringify(i));

  let le = null;
  let leData = null;
  if (i.leadEngineer) {
    le = i.leadEngineer;
    leData = le.data;
  }

  let op = null;
  let opData = null;
  if (i.operator) {
    op = i.operator;
    opData = op.data;
  }

  let qc = null;
  let qcData = null;
  if (i.finalInspectionQualityControl) {
    qc = i.finalInspectionQualityControl;
    qcData = qc.data;
  }

  // console.log("Data:", JSON.stringify(i));
  if (readyForRender(project, description, item)) {
    return (
      <>
        <Page size="A4" style={{ padding: 30, paddingBottom: 40 }}>
          <View fixed>
            <Row style={{ alignItems: "flex-end" }}>
              <Col>
                <Title>Coating Report</Title>
                <P>Generated {time(String(new Date()))}</P>
              </Col>
              <Col style={{ textAlign: "right" }}>
                <P>Item ID</P>
                <Title>{i.itemId}</Title>
              </Col>
            </Row>
            <Line />
          </View>

          <View wrap={false}>
            <Row style={{ marginBottom: 10 }}>
              <Col>
                <Entry label="Project Name" values={p.projectName} />
                <Entry label="Project Number" values={p.projectNumber} />
                <Entry label="Client" values={p.client} />
                {/* <Entry
                    label="ITP Document Number"
                    values={p.itpDocumentNumber}
                  /> */}
                {/* <Entry label="Project Manager" values={p.projectManager} /> */}
                {/* <Entry label="Supervisor" values={p.supervisor} /> */}
                {/* <Entry label="Lead Engineer" values={p.leadEngineer} /> */}
                {/* <Entry
                  label="Supervising Engineer"
                  values={p.supervisingEngineer}
                /> */}
                {/* <Entry label="Quality Control" values={p.qualityControl} /> */}
                <Entry label="Geometry" values={d.geometry} />
                <Entry
                  label="Description"
                  values={d.descriptionNameMaterialNo}
                />
                {description &&
                  description.specifications &&
                  description.specifications.map((spec, specIndex) => {
                    if (
                      spec.data.specificationTitle &&
                      spec.data.specificationValue
                    ) {
                      return (
                        <Entry
                          key={`additional-info-${specIndex}`}
                          label={spec.data.specificationTitle}
                          values={spec.data.specificationValue}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                {/* <Entry label="IFS Activity Codes" values={d.ifsActivityCodes} /> */}
                {/* <Entry label="CPS" values={d.CPS} /> */}
              </Col>
              <Col></Col>
            </Row>
          </View>

          {op && le && (
            <View style={{ paddingBottom: 7 }} wrap={false}>
              <Subtitle>Steel measurements</Subtitle>
              <Line />
              <Entry
                fontStyle="italic"
                label={`Reference point`}
                values={[`Expected`, `Measured`, `Employee`]}
              />
              {op &&
                op.measurementPointActualTdvs.map((obj, index) => {
                  const m = obj.data;
                  return (
                    <Entry
                      key={`measurement-${index}-ref-${m.referencePoint}`}
                      label={`${m.referencePoint}`}
                      values={[
                        `${le.measurementPointActualTdvs[index].data.measurementPointActual}mm`,
                        `${m.measurementPointActual}mm`,
                        m.measurementPointActualUserField
                      ]}
                    />
                  );
                })}
            </View>
          )}

          {leData && opData && (
            <View wrap={false}>
              <Subtitle>Steel Preparation</Subtitle>
              <Line />
              <Row style={{ marginBottom: 10 }}>
                <Col>
                  <Entry
                    label="Test"
                    fontStyle="italic"
                    values={["Standard", "Criteria", "Result", "Employee"]}
                  />
                  {leData.relativeHumidity ? (
                    <Entry
                      label="Relative Humidity"
                      values={[
                        "ISO 8502-4",
                        leData.relativeHumidity
                          ? `Max ${leData.relativeHumidity}%`
                          : " ",
                        opData.relativeHumidity
                          ? `${opData.relativeHumidity}%`
                          : " ",
                        opData.relativeHumidityUserField
                          ? opData.relativeHumidityUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.airTemperature ? (
                    <Entry
                      label="Air Temperature"
                      values={[
                        "ISO 8502-4",
                        leData.airTemperature
                          ? `Min ${leData.airTemperature}°C`
                          : " ",
                        opData.airTemperature
                          ? `${opData.airTemperature}°C`
                          : " ",
                        opData.airTemperatureUserField
                          ? opData.airTemperatureUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.steelTemperature ? (
                    <Entry
                      label="Steel Temperature"
                      values={[
                        "ISO 8502-4",
                        leData.steelTemperature
                          ? `Min ${leData.steelTemperature}°C`
                          : " ",
                        opData.steelTemperature
                          ? `${opData.steelTemperature}°C`
                          : " ",
                        opData.steelTemperatureUserField
                          ? opData.steelTemperatureUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.dewPoint ? (
                    <Entry
                      label="Dew Point"
                      values={[
                        "ISO 8502-4, Dew Point Temperature",
                        leData.dewPoint ? `${leData.dewPoint}°C` : " ",
                        opData.dewPoint ? `${opData.dewPoint}°C` : " ",
                        opData.dewPointUserField
                          ? opData.dewPointUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.temperatureOverDewPoint ? (
                    <Entry
                      label="Temperature over Dew Point"
                      values={[
                        "ISO 8502-4, Difference between Steel Temperature and Dew Point Temperature",
                        leData.temperatureOverDewPoint
                          ? `Min ${leData.temperatureOverDewPoint}°C`
                          : " ",
                        opData.temperatureOverDewPoint
                          ? `${opData.temperatureOverDewPoint}°C`
                          : " ",
                        opData.temperatureOverDewPointUserField
                          ? opData.temperatureOverDewPointUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.blastMediaConductivity ? (
                    <Entry
                      label="Blast Media Conductivity"
                      values={[
                        "ISO 8502-9",
                        leData.blastMediaConductivity
                          ? `Max ${leData.blastMediaConductivity}µS/cm`
                          : " ",
                        opData.blastMediaConductivity
                          ? `${opData.blastMediaConductivity}µS/cm`
                          : " ",
                        opData.blastMediaConductivityUserField
                          ? opData.blastMediaConductivityUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.solubleSaltLevel ? (
                    <Entry
                      label="Soluble Salt Level"
                      values={[
                        "ISO 8502-5/9",
                        leData.solubleSaltLevel
                          ? `Min ${leData.solubleSaltLevel}mg/m²`
                          : " ",
                        opData.solubleSaltLevel
                          ? `${opData.solubleSaltLevel}mg/m²`
                          : " ",
                        opData.solubleSaltLevelUserField
                          ? opData.solubleSaltLevelUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.surfaceProfileMin ? (
                    <Entry
                      label="Surface Profile (Roughness) Min"
                      values={[
                        "ISO 8502-5/9",
                        leData.surfaceProfileMin
                          ? `Min ${leData.surfaceProfileMin}Rz`
                          : " ",
                        opData.surfaceProfileMin
                          ? `${opData.surfaceProfileMin}Rz`
                          : " ",
                        opData.surfaceProfileMinUserField
                          ? opData.surfaceProfileMinUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.surfaceProfileMax ? (
                    <Entry
                      label="Surface Profile (Roughness) Max"
                      values={[
                        "ISO 8502-5/9",
                        leData.surfaceProfileMax
                          ? `Max ${leData.surfaceProfileMax}Rz`
                          : " ",
                        opData.surfaceProfileMax
                          ? `${opData.surfaceProfileMax}Rz`
                          : " ",
                        opData.surfaceProfileMaxUserField
                          ? opData.surfaceProfileMaxUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.dustTest ? (
                    <Entry
                      label="Dust Test"
                      values={[
                        "ISO 8502-3",
                        `Max ${leData.dustTest}`,
                        opData.dustTest,
                        opData.dustTestUserField
                          ? opData.dustTestUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.inspectionOfSteelSurface ? (
                    <Entry
                      label="Inspection of Steel Surface"
                      values={[
                        "ISO 8501-3",
                        "Welds to be grade P3",
                        typeof opData.inspectionOfSteelSurface === "boolean"
                          ? opData.inspectionOfSteelSurface
                            ? "Passed"
                            : "Failed"
                          : " ",
                        opData.inspectionOfSteelSurfaceUserField
                          ? opData.inspectionOfSteelSurfaceUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.compressedAirCheck ? (
                    <Entry
                      label="Compressed Air Check"
                      values={[
                        "ASTM D 4285",
                        "No oil and no water",
                        typeof opData.compressedAirCheck === "boolean"
                          ? opData.compressedAirCheck
                            ? "Passed"
                            : "Failed"
                          : " ",
                        opData.compressedAirCheckUserField
                          ? opData.compressedAirCheckUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.surfaceCleanliness ? (
                    <Entry
                      label="Surface Cleanliness"
                      values={[
                        "ISO 8501-1",
                        "Min. Sa 2,5 (Rust grade A or B)",
                        opData.surfaceCleanliness,
                        opData.surfaceCleanlinessUserField
                          ? opData.surfaceCleanlinessUserField
                          : " "
                      ]}
                    />
                  ) : null}
                  {leData.uvTest ? (
                    <Entry
                      label="UV Test"
                      values={[
                        " ",
                        "No reflecting light",
                        typeof opData.uvTest === "boolean"
                          ? opData.uvTest
                            ? "Passed"
                            : "Failed"
                          : " ",
                        opData.uvTestUserField ? opData.uvTestUserField : " "
                      ]}
                    />
                  ) : null}
                  {/* TODO: Custom tests */}
                  {le &&
                    op &&
                    le.additionalCustomTests &&
                    le.additionalCustomTests.map((test, testIndex) => {
                      test = test.data;
                      return (
                        <Entry
                          key={`additional-test-${testIndex}`}
                          label={test.name}
                          values={[
                            " ",
                            test.criteria,
                            (op.additionalCustomTestOperators &&
                              op.additionalCustomTestOperators[testIndex].data
                                .test) ||
                              " ",
                            (op.additionalCustomTestOperators &&
                              op.additionalCustomTestOperators[testIndex].data
                                .testUserField) ||
                              " "
                          ]}
                        />
                      );
                    })}
                </Col>
              </Row>
            </View>
          )}

          <View wrap={false}>
            <Row style={{ marginBottom: 10 }}>
              {!!leData && !!leData.primer1 && (
                <Col style={{ marginRight: 7 }}>
                  <P>Primer 1</P>
                  <Line />
                  <Entry label="Compound No." values={leData.primer1} />
                  {!!opData &&
                    !!opData.batchNumberPriming1 &&
                    !!time(opData.startTimePriming1) &&
                    !!time(opData.stopTimePriming1) &&
                    !!opData.batchNumberPriming1UserField &&
                    !!opData.startTimePriming1UserField &&
                    !!opData.stopTimePriming1UserField && (
                      <>
                        <Entry
                          label="Batch Number"
                          values={opData.batchNumberPriming1}
                        />
                        <Entry
                          label="Start Time"
                          values={time(opData.startTimePriming1)}
                        />
                        <Entry
                          label="Stop Time"
                          values={time(opData.stopTimePriming1)}
                        />
                        <EmployeeEntry
                          employees={[
                            opData.batchNumberPriming1UserField,
                            opData.startTimePriming1UserField,
                            opData.stopTimePriming1UserField
                          ]}
                          uniqueKeyBase="priming1"
                        />
                      </>
                    )}
                </Col>
              )}
              {!!leData && !!leData.primer2 && (
                <Col style={{ marginRight: 7 }}>
                  <P>Primer 2</P>
                  <Line />
                  <Entry label="Compound No." values={leData.primer2} />
                  {!!opData &&
                    !!opData.batchNumberPriming2 &&
                    !!time(opData.startTimePriming2) &&
                    !!time(opData.stopTimePriming2) &&
                    !!opData.batchNumberPriming2UserField &&
                    !!opData.startTimePriming2UserField &&
                    !!opData.stopTimePriming2UserField && (
                      <Col>
                        <Entry
                          label="Batch Number"
                          values={opData.batchNumberPriming2}
                        />
                        <Entry
                          label="Start Time"
                          values={time(opData.startTimePriming2)}
                        />
                        <Entry
                          label="Stop Time"
                          values={time(opData.stopTimePriming2)}
                        />
                        <EmployeeEntry
                          employees={[
                            opData.batchNumberPriming2UserField,
                            opData.startTimePriming2UserField,
                            opData.stopTimePriming2UserField
                          ]}
                          uniqueKeyBase="priming2"
                        />
                      </Col>
                    )}
                </Col>
              )}
              {!!leData && !!leData.releaseCementsBeforeCoating && (
                <Col style={{ marginRight: 7 }}>
                  <P>Release Cement Before Coating</P>
                  <Line />
                  <Entry
                    label="Release Cement"
                    values={leData.releaseCementsBeforeCoating}
                  />
                  {!!opData &&
                    !!date(opData.rubberCementsBeforeCoatingMixDate) &&
                    !!time(opData.startTimeRubberCement) &&
                    !!time(opData.stopTimeRubberCement) &&
                    !!opData.rubberCementsBeforeCoatingMixDateUserField &&
                    !!opData.startTimeRubberCementUserField &&
                    !!opData.stopTimeRubberCementUserField && (
                      <>
                        <Entry
                          label="Mix Date"
                          values={date(
                            opData.rubberCementsBeforeCoatingMixDate
                          )}
                        />
                        <Entry
                          label="Start Time"
                          values={time(opData.startTimeRubberCement)}
                        />
                        <Entry
                          label="Stop Time"
                          values={time(opData.stopTimeRubberCement)}
                        />
                        <EmployeeEntry
                          employees={[
                            opData.rubberCementsBeforeCoatingMixDateUserField,
                            opData.startTimeRubberCementUserField,
                            opData.stopTimeRubberCementUserField
                          ]}
                        />
                      </>
                    )}
                </Col>
              )}
              {!!leData && !!leData.itemRubberCementsBeforeCoating && (
                <Col style={{ marginRight: 7 }}>
                  <P>Rubber Cement Before Coating</P>
                  <Line />
                  <Entry
                    label="Rubber Cement"
                    values={leData.itemRubberCementsBeforeCoating}
                  />
                  {!!opData &&
                    !!date(opData.itemRubberCementsBeforeCoatingMixDate) &&
                    !!time(opData.startTimeItemRubberCement) &&
                    !!time(opData.stopTimeItemRubberCement) &&
                    !!opData.itemRubberCementsBeforeCoatingMixDateUserField &&
                    !!opData.startTimeItemRubberCementUserField &&
                    !!opData.stopTimeItemRubberCementUserField && (
                      <>
                        <Entry
                          label="Mix Date"
                          values={date(
                            opData.itemRubberCementsBeforeCoatingMixDate
                          )}
                        />
                        <Entry
                          label="Start Time"
                          values={time(opData.startTimeItemRubberCement)}
                        />
                        <Entry
                          label="Stop Time"
                          values={time(opData.stopTimeItemRubberCement)}
                        />
                        <EmployeeEntry
                          employees={[
                            opData.itemRubberCementsBeforeCoatingMixDateUserField,
                            opData.startTimeItemRubberCementUserField,
                            opData.stopTimeItemRubberCementUserField
                          ]}
                        />
                      </>
                    )}
                </Col>
              )}
            </Row>
          </View>

          <View wrap={false}>
            <Subtitle>Coating and Vulcanization</Subtitle>
            <Line />
            <Row>
              <Col style={{ marginRight: 7 }}>
                <Entry
                  style={{ alignItems: "flex-end" }}
                  label="Vulcanization step"
                  fontStyle="italic"
                  values={[
                    "Layer",
                    "Compound No.",
                    "Mix Date",
                    "Date and Time",
                    "Employee"
                  ]}
                />
                {op &&
                  op.vulcanizationOperators.map((obj, index) => {
                    const leSteps = le.vulcanizationSteps;
                    const opSteps = op.vulcanizationOperators;
                    // console.log(steps);
                    const v = obj.data;
                    return opSteps.map((opStep, stepIndex) => {
                      let leStep = leSteps[stepIndex];
                      let layerSum = 0;
                      // const leStepData = leStep.data;
                      const leLayers = leStep.coatingLayers;
                      const opCoatings = opStep.coatingOperators;

                      return opCoatings.map((opCoating, coatingIndex) => {
                        const leLayer = leLayers[coatingIndex];
                        const leLayerData = leLayer.data;
                        const opLayers = opCoating.layers;
                        const opCoatingData = opCoating.data;

                        return opLayers.map((opLayer, layerIndex) => {
                          const opLayerData = opLayer.data;
                          layerSum += 1;

                          return (
                            <Entry
                              key={`vulcanization-${index}-vulcanization-step-${stepIndex}-coating-${coatingIndex}-layer-${layerIndex}`}
                              label={`${
                                coatingIndex === 0 ? stepIndex + 1 : " "
                              }`}
                              values={[
                                layerSum,
                                leLayerData.compoundNumber,
                                date(opLayerData.mixDate),
                                time(opCoatingData.layerApplied),
                                opLayerData.mixDateUserField
                              ]}
                            />
                          );
                        });
                      });
                    });
                  })}
              </Col>
              <Col style={{ width: "34.25%" }}>
                {/* TODO: Add conditional visibility */}
                {/* TODO: Conditional name */}
                {op &&
                  op.rubberCementOperators &&
                  op.rubberCementOperators.length > 0 && (
                    <>
                      <Entry
                        label="Rubber Cement"
                        values={["Mix Date"]}
                        flippedMargin
                      />
                      <Line />
                      {/* TODO: Add entries */}
                      {/* rubberCementOperators */}
                      {op &&
                        op.rubberCementOperators.map(
                          (opRubberCement, rubberCementIndex) => {
                            // const rData = opRubberCement.data;
                            return (
                              <Row key={`rubber-cement-${rubberCementIndex}`}>
                                <Col>
                                  <P style={{ marginBottom: 4 }}>
                                    {
                                      le.rubberCements[rubberCementIndex]
                                        .rubberCement
                                    }
                                  </P>
                                </Col>
                                <Col>
                                  {opRubberCement &&
                                    opRubberCement.mixDates &&
                                    opRubberCement.mixDates.map(
                                      (mixDate, mixDateIndex) => {
                                        return (
                                          <P
                                            key={`rubber-cement-${rubberCementIndex}-${mixDateIndex}`}
                                            style={{
                                              marginBottom: 4,
                                              marginLeft: 3.5
                                            }}
                                          >
                                            {date(mixDate.data.mixDate)}
                                          </P>
                                        );
                                      }
                                    )}
                                </Col>
                              </Row>
                            );
                          }
                        )}
                    </>
                  )}

                {/* TODO: Add conditional visibility */}
                {/* TODO: Create Vulc loop */}
                {op &&
                  op.vulcanizationOperators.map((obj, index) => {
                    const steps = le.vulcanizationSteps;
                    // console.log(steps);
                    const v = obj.data;
                    return (
                      <Row key={`vulcanization-step-${index}`}>
                        <Col>
                          <P style={{ marginTop: 4 }}>{`Vulcanization step ${
                            index + 1
                          }`}</P>
                          <Line />
                          <Entry
                            label="Vulcanization option"
                            values={[steps[index].data.vulcanizationOption]}
                          />
                          <Entry
                            label="Autoclave number"
                            values={[v.autoclaveNumber]}
                          />
                          <Entry
                            label="Start time"
                            values={[time(v.startTime)]}
                          />
                          <Entry
                            label="Stop time"
                            values={[time(v.stopTime)]}
                          />
                        </Col>
                      </Row>
                    );
                  })}
              </Col>
            </Row>
          </View>

          {/* <Subtitle>Touch-Up</Subtitle>
            <Line />
            <Row>
              <Col>
                <Entry
                  label={"Touch-Up"}
                  values={[
                    "Performed/Not performed",
                    "Datetime",
                    "by employee ???"
                  ]}
                />
              </Col>
            </Row> */}

          {qcData && (
            <View wrap={false}>
              <Subtitle>Final Inspection</Subtitle>
              <Line />
              <Entry
                style={{ alignItems: "flex-end" }}
                label={"Test"}
                fontStyle="italic"
                values={["Standard", "Criteria", "Result", "Employee"]}
              />
              {/* {qcData.totalOd &&
                  typeof qcData.totalOd === "boolean" &&
                  qcData.totalOdUserField && (
                    <Entry
                      label="Total OD (Pi-tape)"
                      values={[
                        "APS",
                        "Final measurments are within tolerances",
                        qcData.totalOd ? "Passed" : "Failed",
                        qcData.totalOdUserField
                      ]}
                    />
                  )} */}
              {qcData.visualInspection &&
                typeof qcData.visualInspection === "boolean" &&
                qcData.visualInspectionUserField && (
                  <Entry
                    label="Visual Inspection"
                    values={[
                      "ITP",
                      "Free from defects. Cosmetic defects may be accepted",
                      qcData.visualInspection ? "Passed" : "Failed",
                      qcData.visualInspectionUserField
                    ]}
                  />
                )}
              {qcData.simpleFinalDimensionsCheck &&
                typeof qcData.simpleFinalDimensionsCheck === "boolean" &&
                qcData.simpleFinalDimensionsCheckUserField && (
                  <Entry
                    label="Simplified Final Dimensions Check"
                    values={[
                      "ITP",
                      " ",
                      qcData.simpleFinalDimensionsCheck ? "Passed" : "Failed",
                      qcData.simpleFinalDimensionsCheckUserField
                    ]}
                  />
                )}
              {qcData.sparkTest &&
                typeof qcData.sparkTest === "boolean" &&
                qcData.sparkTestUserField && (
                  <Entry
                    label="Spark Test"
                    values={[
                      "ITP",
                      "No Holidays",
                      qcData.sparkTest ? "Passed" : "Failed",
                      qcData.sparkTestUserField
                    ]}
                  />
                )}
              {qcData.hammerTest &&
                typeof qcData.hammerTest === "boolean" &&
                qcData.hammerTestUserField && (
                  <Entry
                    label="Hammer Test"
                    values={[
                      "ITP",
                      "No change in audible pitch",
                      qcData.hammerTest ? "Passed" : "Failed",
                      qcData.hammerTestUserField
                    ]}
                  />
                )}
              {qcData.identificationMarking &&
                typeof qcData.identificationMarking === "boolean" &&
                qcData.identificationMarkingUserField && (
                  <Entry
                    label="Identification Marking"
                    values={[
                      " ",
                      `Item ID matches ${item.itemId}`,
                      qcData.identificationMarking ? "Passed" : "Failed",
                      qcData.identificationMarkingUserField
                    ]}
                  />
                )}
              {le &&
                qc &&
                le.finalInspectionCustomTests &&
                le.finalInspectionCustomTests.map((test, testIndex) => {
                  test = test.data;
                  return (
                    <Entry
                      key={`additional-test-${testIndex}`}
                      label={test.name}
                      values={[
                        " ",
                        test.criteria,
                        (qc.finalInspectionCustomTestQualityControls &&
                          qc.finalInspectionCustomTestQualityControls[testIndex]
                            .data.test) ||
                          " ",
                        (qc.finalInspectionCustomTestQualityControls &&
                          qc.finalInspectionCustomTestQualityControls[testIndex]
                            .data.testUserField) ||
                          " "
                      ]}
                    />
                  );
                })}
              {leData &&
                qc &&
                qc.hardnessQualityControls &&
                qc.hardnessQualityControls.map((test, testIndex) => {
                  test = test.data;
                  return (
                    <Entry
                      key={`hardness-${testIndex}`}
                      label={testIndex === 0 ? "Hardness of Outer Layer" : " "}
                      values={[
                        " ",
                        testIndex === 0
                          ? `Minimum ${leData.hardnessOfOuterLayer} Shore A`
                          : " ",
                        `${
                          qc.hardnessQualityControls.length > 1
                            ? `Test ${testIndex + 1}: `
                            : ""
                        }${test.hardnessOfOuterLayer} Shore A`,
                        test.hardnessOfOuterLayerUserField
                      ]}
                    />
                  );
                })}
              {leData &&
                qc &&
                qc.peelTestQualityControls &&
                qc.peelTestQualityControls.map((test, testIndex) => {
                  test = test.data;
                  return (
                    <Entry
                      key={`peelTest-${testIndex}`}
                      label={testIndex === 0 ? "Peel Test" : " "}
                      values={[
                        " ",
                        testIndex === 0
                          ? `Minimum ${(leData.peelTest * 9.81).toFixed(
                              2
                            )}N/25mm`
                          : " ",
                        `${
                          qc.peelTestQualityControls.length > 1
                            ? `Test ${testIndex + 1}: `
                            : ""
                        }${(test.peelTest * 9.81).toFixed(2)}N/25mm`,
                        test.peelTestUserField
                      ]}
                    />
                  );
                })}
              {le &&
                qc &&
                qc.measurementPointQualityControls &&
                le.measurementPointActualTdvs && (
                  <>
                    <P style={{ paddingTop: 5 }}>Final Measurements</P>
                    <Line />
                    <Entry
                      fontStyle="italic"
                      label={`Reference`}
                      values={["Minimum", "Maximum", "Measured", "Employee"]}
                    />
                    {qc.measurementPointQualityControls.map(
                      (measurementPoint, measurementPointIndex) => {
                        console.log(d.geometry);
                        const reference =
                          le.measurementPointActualTdvs[measurementPointIndex]
                            .data.referencePoint;
                        let minimum = " ";
                        let maximum = " ";
                        const measure = String(
                          measurementPoint.data.measurementPoint
                        );
                        const user = String(
                          measurementPoint.data.measurementPointUserField
                        );

                        switch (d.geometry) {
                          case "Coated Item":
                            minimum = String(
                              Math.mathToleranceMin(i, measurementPointIndex)
                            );
                            maximum = String(
                              Math.mathToleranceMax(i, measurementPointIndex)
                            );
                            break;

                          case "Mould":
                            minimum = String(Math.mathMin(i));
                            maximum = String(Math.mathMax(i));
                            break;

                          default:
                            break;
                        }

                        return (
                          <Entry
                            key={`final-inspection-dimension-check-${measurementPointIndex}`}
                            label={`${reference || " "}`}
                            values={[minimum, maximum, measure, user]}
                          />
                        );
                      }
                    )}
                  </>
                )}
              {le &&
                qc &&
                le.finalInspectionDimensionsChecks &&
                qc.finalInspectionDimensionsCheckQualityControls && (
                  <>
                    <P style={{ paddingTop: 5 }}>Final Dimensions Check</P>
                    <Line />
                    <Entry
                      fontStyle="italic"
                      label={`Reference`}
                      values={["Minimum", "Maximum", "Measured", "Employee"]}
                    />
                    {le.finalInspectionDimensionsChecks.map(
                      (dimCheck, dimCheckIndex) => {
                        return (
                          <Entry
                            key={`final-inspection-dimension-check-${dimCheckIndex}`}
                            label={`${
                              dimCheck.data.finalDimensionsReference || " "
                            }`}
                            values={[
                              dimCheck.data.finalDimensionsMin
                                ? `${dimCheck.data.finalDimensionsMin}mm`
                                : " ",
                              dimCheck.data.finalDimensionsMax
                                ? `${dimCheck.data.finalDimensionsMax}mm`
                                : " ",
                              qc.finalInspectionDimensionsCheckQualityControls[
                                dimCheckIndex
                              ].data.finalInspectionDimensionsChecks
                                ? String(
                                    qc
                                      .finalInspectionDimensionsCheckQualityControls[
                                      dimCheckIndex
                                    ].data.finalInspectionDimensionsChecks
                                  ) + "mm"
                                : " ",
                              qc.finalInspectionDimensionsCheckQualityControls[
                                dimCheckIndex
                              ].data.finalInspectionDimensionsChecksUserField
                                ? qc
                                    .finalInspectionDimensionsCheckQualityControls[
                                    dimCheckIndex
                                  ].data
                                    .finalInspectionDimensionsChecksUserField
                                : " "
                            ]}
                          />
                        );
                      }
                    )}
                  </>
                )}
              {qcData.finalInspectionComment && (
                <>
                  <P style={{ paddingTop: 5 }}>Final Inspection Comment</P>
                  <Line />
                  <P>{qcData.finalInspectionComment}</P>
                </>
              )}
            </View>
          )}
          <Text
            style={{
              position: "absolute",
              // fontFamily: "Roboto",
              fontSize: fontsize,
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: "center"
            }}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
        {
          // Attachments
          false && (
            <Page size="A4" style={{ padding: 30 }}>
              <Row style={{ alignItems: "flex-end" }}>
                <Col>
                  <Title>Attachments</Title>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  <P>Item ID</P>
                  <Title>{i.itemId}</Title>
                </Col>
              </Row>
              <Line />
            </Page>
          )
        }
      </>
    );
  }

  return null;
};

export const ReportsDownload = ({ project, filter = "", ...props }) => {
  const id = project.id;

  let { loading: dataLoading, error: dataError, data } = useQuery(
    query["REPORTS"],
    {
      variables: {
        id
      }
    }
  );

  if (!!data && !!project) {
    try {
      return (
        <PDFDownloadLink
          document={
            <Reports
              project={objectifyQuery(data.projects[0])}
              filter={filter}
            />
          }
          {...props}
        >
          {({ blob, url, loading, error }) => {
            return (
              <Button
                variant={"success"}
                className="w-100"
                disabled={loading || error}
              >
                {dataLoading || loading
                  ? "Loading..."
                  : dataError || error
                  ? "Error!"
                  : props.children}
              </Button>
            );
          }}
        </PDFDownloadLink>
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  return null;
};

export const ReportDownload = ({ project, description, item, ...props }) => {
  const id = project.id;

  let { loading: dataLoading, error: dataError, data } = useQuery(
    query["REPORT"],
    {
      variables: {
        id
      }
    }
  );

  if (!!data) {
    item = data["items"][0];

    try {
      return (
        readyForRender(project, description, item) && (
          <PDFDownloadLink
            document={
              <Report project={project} description={description} item={item} />
            }
            {...props}
          >
            {({ blob, url, loading, error }) => {
              return (
                <Button
                  variant={"success"}
                  className="w-100"
                  disabled={loading || error}
                >
                  {dataLoading || loading
                    ? "Loading..."
                    : dataError || error
                    ? "Error!"
                    : props.children}
                </Button>
              );
            }}
          </PDFDownloadLink>
        )
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  return null;
};

export const ReportsViewer = ({ project, filter = "", ...props }) => {
  const id = project.id;

  let { loading, error, data } = useQuery(query["REPORTS"], {
    variables: {
      id
    }
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return error;
  }

  if (!!data) {
    // console.log(data);
    if (!!project) {
      return (
        <PDFViewer
          className="w-100"
          style={{ maxHeight: "calc(100vh - 200px)", height: 1000 }}
        >
          <Reports
            project={objectifyQuery(data.projects[0])}
            filter={filter}
          ></Reports>
        </PDFViewer>
      );
    }

    return null;
  }

  return null;
};

export default ({ project, description, item, ...props }) => {
  const id = item.id;
  // const id = item["item"][id];

  if (!id) {
    return "No item ID received.";
  }

  let { loading, error, data } = useQuery(query["REPORT"], {
    variables: {
      id
    }
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return error;
  }

  if (data) {
    item = data["items"][0];
    // Delete
    // const i = data["items"][0];
    // const le = i.leadEngineer;
    // const op = i.operator;

    return (
      <PDFViewer
        className="w-100"
        style={{ maxHeight: "calc(100vh - 200px)", height: 1000 }}
      >
        <Report
          project={project}
          description={description}
          item={data["items"][0]}
        ></Report>
      </PDFViewer>
    );
  }

  return null;
};

const Entry = ({
  label,
  values,
  tight = false,
  flippedMargin = false,
  fontStyle = "normal",
  ...props
}) => {
  const isNonEmpty = [undefined, null, false, true, ""].includes(values);
  const hasValues = isNonEmpty || (Array.isArray(values) && values.length < 1);

  if (hasValues) {
    return null;
  }

  const colStyle = {
    marginLeft: 7
  };

  return (
    <Row
      {...props}
      style={{
        marginBottom: flippedMargin || tight ? 0 : 4,
        marginTop: flippedMargin ? 4 : 0,
        ...props.style
      }}
    >
      <Col>
        {fontStyle === "normal" && <P>{label}</P>}
        {fontStyle === "bold" && <B>{label}</B>}
        {fontStyle === "italic" && <I>{label}</I>}
      </Col>
      {Array.isArray(values) ? (
        values.map(
          (value, index) =>
            value && (
              <Col key={`${label}-value-${index}`} style={colStyle}>
                {fontStyle === "normal" && <P>{value}</P>}
                {fontStyle === "bold" && <B>{value}</B>}
                {fontStyle === "italic" && <I>{value}</I>}
              </Col>
            )
        )
      ) : (
        <Col style={colStyle}>
          {fontStyle === "normal" && <P>{values}</P>}
          {fontStyle === "bold" && <B>{values}</B>}
          {fontStyle === "italic" && <I>{values}</I>}
        </Col>
      )}
    </Row>
  );
};

const EmployeeEntry = ({ employees, uniqueKeyBase }) => {
  return [employees].map(employeesArray => {
    let employeesReduced = [];

    employeesArray.forEach(employee => {
      if (employee && !employeesReduced.includes(employee)) {
        employeesReduced.push(employee);
      }
    });

    return employeesReduced.map((employee, employeeIndex) => {
      return (
        <Entry
          key={`${uniqueKeyBase}-${employee}-${employeeIndex}`}
          label={
            employeeIndex === 0
              ? employeesReduced.length > 1
                ? "Employees"
                : "Employee"
              : " "
          }
          values={employee}
        />
      );
    });
  });
};

const Line = props => {
  return (
    <View
      {...props}
      style={{
        borderBottom: "1pt solid #DDDDDD",
        width: "100%",
        marginVertical: "3pt",
        ...props.style
      }}
    ></View>
  );
};

const Row = props => {
  return (
    <View
      {...props}
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        ...props.style
      }}
    >
      {props.children}
    </View>
  );
};

const Col = props => {
  return (
    <View
      {...props}
      style={{ width: "100%", fontSize: fontsize, ...props.style }}
    >
      {props.children}
    </View>
  );
};

const Shell = props => {
  return (
    <Row>
      <Col>{props.children}</Col>
    </Row>
  );
};

const Title = props => {
  return (
    <Shell>
      <Text
        {...props}
        style={{
          fontSize: fontsize * 1.5,
          // fontFamily: "Roboto",
          fontWeight: 500,
          ...props.style
        }}
      >
        {props.children}
      </Text>
    </Shell>
  );
};

const Subtitle = props => {
  return (
    <Shell>
      <Text
        {...props}
        style={{
          fontSize: fontsize * 1.25,
          // fontFamily: "Roboto",
          fontWeight: 500,
          ...props.style
        }}
      >
        {props.children}
      </Text>
    </Shell>
  );
};

const P = props => {
  return (
    <Shell>
      <Text
        {...props}
        style={{
          fontSize: fontsize,
          // fontFamily: "Roboto",
          ...props.style
        }}
      >
        {props.children}
      </Text>
    </Shell>
  );
};

const B = props => {
  return (
    <Shell>
      <Text
        {...props}
        style={{
          fontSize: fontsize * 1.0625,
          // fontFamily: "Roboto",
          fontWeight: 500,
          ...props.style
        }}
      >
        {props.children}
      </Text>
    </Shell>
  );
};

const I = props => {
  return (
    <Shell>
      <Text
        {...props}
        style={{
          fontSize: fontsize,
          // fontFamily: "Roboto",
          fontStyle: "italic",
          ...props.style
        }}
      >
        {props.children}
      </Text>
    </Shell>
  );
};

const registerFonts = () => {
  Font.registerEmojiSource({
    format: "png",
    url: "https://twemoji.maxcdn.com/2/72x72/"
  });

  /**
   * Fonts found in this list:
   * https://gist.github.com/karimnaaji/b6c9c9e819204113e9cabf290d580551
   */
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/W5F8_SL0XFawnjxHGsZjJA.ttf",
        fontWeight: 400
      },
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/hcKoSgxdnKlbH5dlTwKbow.ttf",
        fontStyle: "italic",
        fontWeight: 400
      },
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf",
        fontWeight: 100
      },
      {
        src:
          "http://fonts.gstatic.com/s/roboto/v15/T1xnudodhcgwXCmZQ490TPesZW2xOQ-xsNqO47m55DA.ttf",
        fontStyle: "italic",
        fontWeight: 100
      },
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/dtpHsbgPEm2lVWciJZ0P-A.ttf",
        fontWeight: 300
      },
      {
        src:
          "http://fonts.gstatic.com/s/roboto/v15/iE8HhaRzdhPxC93dOdA056CWcynf_cDxXwCLxiixG1c.ttf",
        fontStyle: "italic",
        fontWeight: 300
      },
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/Uxzkqj-MIMWle-XP2pDNAA.ttf",
        fontWeight: 500
      },
      {
        src:
          "http://fonts.gstatic.com/s/roboto/v15/daIfzbEw-lbjMyv4rMUUTqCWcynf_cDxXwCLxiixG1c.ttf",
        fontStyle: "italic",
        fontWeight: 500
      },
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/bdHGHleUa-ndQCOrdpfxfw.ttf",
        fontWeight: 700
      },
      {
        src:
          "http://fonts.gstatic.com/s/roboto/v15/owYYXKukxFDFjr0ZO8NXh6CWcynf_cDxXwCLxiixG1c.ttf",
        fontStyle: "italic",
        fontWeight: 700
      },
      {
        src: "http://fonts.gstatic.com/s/roboto/v15/H1vB34nOKWXqzKotq25pcg.ttf",
        fontWeight: 900
      },
      {
        src:
          "http://fonts.gstatic.com/s/roboto/v15/b9PWBSMHrT2zM5FgUdtu0aCWcynf_cDxXwCLxiixG1c.ttf",
        fontStyle: "italic",
        fontWeight: 900
      }
    ]
  });
};

// registerFonts();
