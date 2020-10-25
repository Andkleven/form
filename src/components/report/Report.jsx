import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  // StyleSheet,
  Font,
  PDFViewer,
  PDFDownloadLink
  // BlobProvider,
  // Canvas,
  // pdf
} from "@react-pdf/renderer";
import { Button } from "react-bootstrap";
import query from "graphql/query";
import { useQuery } from "react-apollo";
import Loading from "components/Loading";
import moment from "moment";
import { objectifyQuery } from "functions/general";

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

const fontsize = 7;

const time = string => moment(string).format("DD.MM.YYYY HH:mm");
const date = string => moment(string).format("DD.MM.YYYY");

export const Report = ({ project, description, item }) => {
  const p = project && project.data;
  const d = description && description.data;
  const i = item && objectifyQuery(item);

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

  // console.log("Item", i);
  // console.log("leData", leData);
  // console.log("opData", opData);
  // console.log("qcData", qcData);
  // console.log("le", le);
  // console.log("op", op);
  // console.log("qc", qc);

  // const qc =
  if (p && d && i) {
    return (
      <Document
        title="Report"
        author="Trelleborg Offshore Norway AS"
        creator="Trelleborg Offshore Norway AS"
        producer="Trelleborg Offshore Norway AS"
        subject="Coating Report"
        keywords="coating report trelleborg offshore norway as"
      >
        <Page size="A4" style={{ padding: 30 }}>
          <Row style={{ alignItems: "flex-end" }}>
            <Col>
              <Title>Coating Report</Title>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Title>Item Number: {i.itemId}</Title>
            </Col>
          </Row>
          <Line />
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <Entry label="Project Name" values={p.projectName} />
              <Entry label="Project Number" values={p.projectNumber} />
              <Entry label="Client" values={p.client} />
              <Entry label="ITP Document Number" values={p.itpDocumentNumber} />
              {/* <Entry label="Project Manager" values={p.projectManager} /> */}
              {/* <Entry label="Supervisor" values={p.supervisor} /> */}
              {/* <Entry label="Lead Engineer" values={p.leadEngineer} /> */}
              {/* <Entry
                label="Supervising Engineer"
                values={p.supervisingEngineer}
              /> */}
              {/* <Entry label="Quality Control" values={p.qualityControl} /> */}
              <Entry label="Geometry" values={d.geometry} />
              <Entry label="Description" values={d.descriptionNameMaterialNo} />
              {/* <Entry label="IFS Activity Codes" values={d.ifsActivityCodes} /> */}
              {/* <Entry label="CPS" values={d.CPS} /> */}
            </Col>
            <Col></Col>
          </Row>

          {leData && opData && (
            <>
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
                        leData.relativeHumidity &&
                          `${leData.relativeHumidity}%`,
                        opData.relativeHumidity &&
                          `${opData.relativeHumidity}%`,
                        opData.relativeHumidityUserField
                      ]}
                    />
                  ) : null}
                  {leData.airTemperature ? (
                    <Entry
                      label="Air Temperature"
                      values={[
                        "ISO 8502-4",
                        leData.airTemperature && `${leData.airTemperature}°C`,
                        opData.airTemperature && `${opData.airTemperature}°C`,
                        opData.airTemperatureUserField
                      ]}
                    />
                  ) : null}
                  {leData.steelTemperature ? (
                    <Entry
                      label="Steel Temperature"
                      values={[
                        "ISO 8502-4",
                        leData.steelTemperature &&
                          `${leData.steelTemperature}°C`,
                        opData.steelTemperature &&
                          `${opData.steelTemperature}°C`,
                        opData.steelTemperatureUserField
                      ]}
                    />
                  ) : null}
                  {leData.temperatureOverDewPoint ? (
                    <Entry
                      label="Temperature over Dew Point"
                      values={[
                        "ISO 8502-4, Difference between Steel Temperature and Dew Point Temperature",
                        leData.temperatureOverDewPoint &&
                          `${leData.temperatureOverDewPoint}°C`,
                        opData.temperatureOverDewPoint &&
                          `${opData.temperatureOverDewPoint}°C`,
                        opData.temperatureOverDewPointUserField
                      ]}
                    />
                  ) : null}
                  {leData.blastMediaConductivity ? (
                    <Entry
                      label="Blast Media Conductivity"
                      values={[
                        "ISO 8502-9",
                        leData.blastMediaConductivity &&
                          `${leData.blastMediaConductivity}µS/cm`,
                        opData.blastMediaConductivity &&
                          `${opData.blastMediaConductivity}µS/cm`,
                        opData.blastMediaConductivityUserField
                      ]}
                    />
                  ) : null}
                  {leData.solubleSaltLevel ? (
                    <Entry
                      label="Soluble Salt Level"
                      values={[
                        "ISO 8502-5/9",
                        leData.solubleSaltLevel &&
                          `${leData.solubleSaltLevel}mg/m²`,
                        opData.solubleSaltLevel &&
                          `${opData.solubleSaltLevel}mg/m²`,
                        opData.solubleSaltLevelUserField
                      ]}
                    />
                  ) : null}
                  {leData.dustTest ? (
                    <Entry
                      label="Dust Test"
                      values={[
                        "ISO 8502-3, Whole number between 1-5",
                        leData.dustTest,
                        opData.dustTest,
                        opData.dustTestUserField
                      ]}
                    />
                  ) : null}
                  {leData.inspectionOfSteelSurface ? (
                    <Entry
                      label="Inspection of Steel Surface"
                      values={[
                        "ISO 8501-3, Welds to be grade P3",
                        leData.inspectionOfSteelSurface,
                        opData.inspectionOfSteelSurface,
                        opData.inspectionOfSteelSurfaceUserField
                      ]}
                    />
                  ) : null}
                  {leData.compressedAirCheck ? (
                    <Entry
                      label="Compressed Air Check"
                      values={[
                        "ASTM D 4285, No oil and no water",
                        leData.compressedAirCheck,
                        opData.compressedAirCheck,
                        opData.compressedAirCheckUserField
                      ]}
                    />
                  ) : null}
                  {leData.surfaceCleanliness ? (
                    <Entry
                      label="Surface Cleanliness"
                      values={[
                        "ISO 8501-1, Min. Sa 2,5 (Rust grade A or B)",
                        leData.surfaceCleanliness,
                        opData.surfaceCleanliness,
                        opData.surfaceCleanlinessUserField
                      ]}
                    />
                  ) : null}
                  {leData.uvTest ? (
                    <Entry
                      label="UV Test"
                      values={[
                        "No reflecting light",
                        leData.uvTest,
                        opData.uvTest,
                        opData.uvTestUserField
                      ]}
                    />
                  ) : null}
                  {/* TODO: Custom tests */}
                </Col>
              </Row>
            </>
          )}
          <Row style={{ marginBottom: 10 }}>
            {leData && leData.primer1 && (
              <Col style={{ marginRight: 7 }}>
                <B>Primer 1</B>
                <Line />
                <Entry label="Compound No." values={leData.primer1} />
                {opData && (
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
                {/* TODO: Add Primer 1 entries */}
              </Col>
            )}
            {leData && leData.primer2 && (
              <Col style={{ marginRight: 7 }}>
                <B>Primer 2</B>
                <Line />
                <Entry label="Compound No." values={leData.primer2} />
                {opData && (
                  <>
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
                  </>
                )}
                {/* TODO: Add Primer 2 entries */}
              </Col>
            )}
            <Col style={{ marginRight: 7 }}>
              <B>Release Cement Before Coating</B>
              <Line />
              <Entry label="Release Cement" values={"—"} />
              <Entry label="Mix Date" values={"—"} />
              <Entry label="Start Time" values={"—"} />
              <Entry label="Stop Time" values={"—"} />
              <Entry label="Employee" values={"—"} />
              {/* TODO: Add Rubber Cement Before Coating entries */}
            </Col>
            <Col style={{ marginRight: 7 }}>
              <B>Rubber Cement Before Coating</B>
              <Line />
              <Entry label="Rubber Cement" values={"—"} />
              <Entry label="Mix Date" values={"—"} />
              <Entry label="Start Time" values={"—"} />
              <Entry label="Stop Time" values={"—"} />
              <Entry label="Employee" values={"—"} />
              {/* TODO: Add Rubber Cement Before Coating entries */}
            </Col>
          </Row>

          <Subtitle>Coating and Vulcanization</Subtitle>
          <Line />
          <Row>
            <Col style={{ marginRight: 7 }}>
              <Entry
                style={{ alignItems: "flex-end" }}
                label="Step"
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
                  console.log("Report -> opSteps", opSteps);
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
            <Col style={{ width: "51%" }}>
              {/* TODO: Add conditional visibility */}
              {/* TODO: Conditional name */}
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
                            {le.rubberCements[rubberCementIndex].rubberCement}
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
                                    style={{ marginBottom: 4, marginLeft: 3.5 }}
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

              {/* TODO: Add conditional visibility */}
              {/* TODO: Create Vulc loop */}
              {op &&
                op.vulcanizationOperators.map((obj, index) => {
                  const steps = le.vulcanizationSteps;
                  // console.log(steps);
                  const v = obj.data;
                  return (
                    <>
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
                        {/* "{"startTime": "2020-08-31T11:47", "stopTime": "2020-09-01T07:24", "autoclaveNumberUserField": "admin", "startTimeUserField": "admin", "stopTimeUserField": "admin"}" */}
                      </Row>
                    </>
                  );
                })}

              {/* TODO: Add entries */}

              {/* TODO: Add conditional visibility */}
              <Entry
                label="Steel measurements"
                // TODO: Add actual min-max
                values={[`(min-max: ${1}mm-${999}mm)`]}
                flippedMargin
              />
              <Line />
              {op &&
                op.measurementPointActualTdvs.map((obj, index) => {
                  const m = obj.data;
                  return (
                    <Entry
                      key={`measurement-${index}-ref-${m.referencePoint}`}
                      label={`Reference point ${m.referencePoint}`}
                      values={[`${m.measurementPointActual}mm`]}
                    />
                  );
                })}
            </Col>
          </Row>

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

          <Subtitle>Final Inspection</Subtitle>
          <Line />
          <P style={{ marginBottom: 10 }}>Submitted on {"TODO: Datetime"}</P>

          <Entry
            style={{ alignItems: "flex-end" }}
            label={"Test"}
            fontStyle="italic"
            values={["Standard", "Criteria", "Result", "Employee"]}
          />
        </Page>

        <Page size="A4" style={{ padding: 30 }}>
          <Row style={{ alignItems: "flex-end" }}>
            <Col>
              <Title>Attachments</Title>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <P>Item Number: {i.itemId}</P>
            </Col>
          </Row>
          <Line />
        </Page>
      </Document>
    );
  }

  return null;
};

export const ReportDownload = ({ project, description, item, ...props }) => {
  return (
    <PDFDownloadLink
      document={
        <Report project={project} description={description} item={item} />
      }
      {...props}
    >
      {({ blob, url, loading, error }) => {
        return (
          <Button variant={"success"} className="w-100" disabled={loading}>
            {loading ? "Loading..." : props.children}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
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
    // Delete
    const i = data["items"][0];
    // const le = i.leadEngineer;
    const op = i.operator;

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
          fontFamily: "Roboto",
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
          fontFamily: "Roboto",
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
          fontFamily: "Roboto",
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
          fontSize: fontsize * 1.125,
          fontFamily: "Roboto",
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
          fontFamily: "Roboto",
          fontStyle: "italic",
          ...props.style
        }}
      >
        {props.children}
      </Text>
    </Shell>
  );
};

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
