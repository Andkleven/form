import React from "react";
import { objectifyQuery } from "functions/general";
import { Page, Text, View } from "@react-pdf/renderer";
import Math from "functions/math";
import {
  readyForRender,
  Row,
  Col,
  Title,
  P,
  time,
  Line,
  Entry,
  Subtitle,
  EmployeeEntry,
  date,
  fontsize
} from "./Report";

export default ({ project, description, item }) => {
  const p = project && project.data;
  const d = description && description.data;
  const i = item && objectifyQuery(item);

  // console.log(JSON.stringify(i));
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
                <Subtitle>{i.itemId}</Subtitle>
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

                <Entry label="Geometry" values={d.geometry} />
                <Entry
                  label="Description"
                  values={d.descriptionNameMaterialNo}
                />
                {!!description &&
                  !!description.specifications &&
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
              </Col>
              <Col></Col>
            </Row>
          </View>

          {!!op && !!le && (
            <View style={{ paddingBottom: 7 }} wrap={false}>
              <Subtitle>Steel measurements</Subtitle>
              <Line />
              <Entry
                fontStyle="italic"
                label={`Reference point`}
                values={[`Expected`, `Measured`, `Employee`]}
              />
              {!!op &&
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

          {!!leData && !!opData && (
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
                  {!!leData.relativeHumidity ? (
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
                  {!!leData.airTemperature ? (
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
                  {!!leData.steelTemperature ? (
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
                  {!!leData.dewPoint ? (
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
                  {!!leData.temperatureOverDewPoint ? (
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
                  {!!leData.blastMediaConductivity ? (
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
                  {!!leData.solubleSaltLevel ? (
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
                  {!!leData.surfaceProfileMin ? (
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
                  {!!leData.surfaceProfileMax ? (
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
                  {!!leData.dustTest ? (
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
                  {!!leData.inspectionOfSteelSurface ? (
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
                  {!!leData.compressedAirCheck ? (
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
                  {!!leData.surfaceCleanliness ? (
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
                  {!!leData.uvTest ? (
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

                  {!!le &&
                    !!op &&
                    !!le.additionalCustomTests &&
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
                {!!op &&
                  op.vulcanizationOperators.map((obj, index) => {
                    const leSteps = le.vulcanizationSteps;
                    const opSteps = op.vulcanizationOperators;
                    // console.log(steps);
                    // const v = obj.data;
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
                {!!op &&
                  !!op.rubberCementOperators &&
                  op.rubberCementOperators.length > 0 && (
                    <>
                      <Entry
                        label="Rubber Cement"
                        values={["Mix Date"]}
                        flippedMargin
                      />
                      <Line />

                      {!!op &&
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

                {!!op &&
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
                            label="Vulc. option"
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

          {!!qcData && (
            <View wrap={false}>
              <Subtitle>Final Inspection</Subtitle>
              <Line />
              <Entry
                style={{ alignItems: "flex-end" }}
                label={"Test"}
                fontStyle="italic"
                values={["Standard", "Criteria", "Result", "Employee"]}
              />
              {!!qcData.visualInspection &&
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
              {!!qcData.simpleFinalDimensionsCheck &&
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
              {!!qcData.sparkTest &&
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
              {!!qcData.hammerTest &&
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
              {!!qcData.identificationMarking &&
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
                        "ITP",
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
                        "ITP",
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
                        const reference =
                          le.measurementPointActualTdvs[measurementPointIndex]
                            .data.referencePoint;
                        let minimum = " ";
                        let maximum = " ";
                        const measure =
                          String(measurementPoint.data.measurementPoint) + "mm";
                        const user = String(
                          measurementPoint.data.measurementPointUserField
                        );

                        switch (d.geometry) {
                          case "Coated Item":
                            minimum = String(
                              Math.mathToleranceMin(i, measurementPointIndex) +
                                "mm"
                            );
                            maximum = String(
                              Math.mathToleranceMax(i, measurementPointIndex) +
                                "mm"
                            );
                            break;

                          case "Mould":
                            minimum = String(Math.mathMin(i)) + "mm";
                            maximum = String(Math.mathMax(i)) + "mm";
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
              {!!qcData.finalInspectionComment && (
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
