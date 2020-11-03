import React from "react";
import query from "graphql/query";
import { useQuery } from "react-apollo";
import { objectifyQuery } from "functions/general";
import {
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
import CoatingReport from "./CoatingReport";

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

export const fontsize = 7.5;

export const time = string =>
  typeof string === "string" &&
  !["", " "].includes(string) &&
  moment(string).format("DD.MM.YYYY HH:mm");
export const date = string =>
  typeof string === "string" &&
  !["", " "].includes(string) &&
  moment(string).format("DD.MM.YYYY");

export const readyForRender = (project, description, item) => {
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
          <CoatingReport
            project={project}
            description={description}
            item={item}
          />
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
                  <CoatingReport
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

export const Entry = ({
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
        values.map((value, index) =>
          value ? (
            <Col key={`${label}-value-${index}`} style={colStyle}>
              {fontStyle === "normal" && <P>{value}</P>}
              {fontStyle === "bold" && <B>{value}</B>}
              {fontStyle === "italic" && <I>{value}</I>}
            </Col>
          ) : (
            <Col key={`${label}-value-${index}-empty`} style={colStyle} />
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

export const EmployeeEntry = ({ employees, uniqueKeyBase }) => {
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

export const Line = props => {
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

export const Row = props => {
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

export const Col = props => {
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

export const Title = props => {
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

export const Subtitle = props => {
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

export const P = props => {
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
