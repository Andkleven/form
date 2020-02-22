import React, { Fragment, useState, createContext, useEffect } from "react";
import MutationGeneral from "../components/MutationGeneral";
import ListUpdateMutation from "../components/ListUpdateMutation";
import query from "../request/leadEngineer/Query";
import mutations from "../request/leadEngineer/MutationToDatabase";
import objectPath from "object-path";
import { Card, Container } from "react-bootstrap";
import SubmitButton from "../components/SubmitButton";
import { useMutation } from "@apollo/react-hooks";

export const GruppContext = createContext();
export const FilesContext = createContext();
export const ValuesContext = createContext();

export default props => {
  useEffect(() => {
    if (!props.componentsId) {
      console.error(
        "Du har ikke gitt komponent Canvas en 'componentsId'. Tips: Sett componentsId lik navnet på komponenten som kjører Canvas komponeten."
      );
    }
    if (props.json === undefined && props.json === null) {
      console.error("Du må gi en 'json' til komponent Canvas");
    }
    if (props.data === undefined && props.data === null) {
      console.error("Du må gi en 'data' til komponent Canvas");
    }
  }, [props.componentsId, props.json, props.data]);

  const [gruppState, setGruppState] = useState(0);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [validationPassed, setvalidationPassed] = useState({});
  const [addForm, setAddForm] = useState(false);

  useEffect(() => {
    setValues({});
  }, [props.componentsId]);

  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy }
    });
    var array = objectPath.get(oldData, props.json.queryPath);
    var index = array.findIndex(
      x => x.id === data[props.json.queryPath.split(/[.]+/).pop()].new.id
    );
    objectPath.set(
      oldData,
      `${props.json.queryPath}.${index}`,
      data[props.json.queryPath.split(/[.]+/).pop()].new
    );
    var saveData = props.json.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const updateWithVariable = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy }
    });
    var secondQueryPath = "";
    var newData = data[props.firstQueryPath.split(/[.]+/).pop()];
    if (props.secondQueryPath.trim()) {
      newData = data[props.secondQueryPath.split(/[.]+/).pop()];
      secondQueryPath = `.${props.arrayIndex}.${props.secondQueryPath}`;
    }
    var array = objectPath.get(
      oldData,
      [props.firstQueryPath] + secondQueryPath
    );
    var index = 0;
    if (props.secondQueryPath.trim()) {
      index = array.findIndex(x => x.id === newData.new.id);
    } else {
      index = array.findIndex(x => x.id === newData.new.id);
    }
    objectPath.set(
      oldData,
      `${props.firstQueryPath}${secondQueryPath}.${index}`,
      newData.new
    );
    var saveData = props.firstQueryPath.split(/[.]+/).splice(0, 1)[0];

    cache.writeQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };
  const create = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy }
    });
    objectPath.push(
      oldData,
      props.json.queryPath,
      data[props.json.queryPath.split(/[.]+/).pop()].new
    );
    var saveData = props.json.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const createWithVariable = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.json.query],
      variables: { id: props.getQueryBy }
    });
    objectPath.push(
      oldData,
      `${props.firstQueryPath}.${props.arrayIndex}.${props.secondQueryPath}`,
      data[props.secondQueryPath.split(/[.]+/).pop()].new
    );
    var saveData = props.firstQueryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: props.json.query,
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };
  // props.data[Object.keys(props.data)[0]].id
  //       ? props.firstQueryPath
  //         ? updateWithVariable
  //         : update
  //       : props.firstQueryPath
  //       ? createWithVariable
  //       : create
  const [mutation, { loadingMutation, error: errorMutation }] = useMutation(
    mutations[props.json.mutation],
    {
      update:
        !props.data ||
        !props.data[Object.keys(props.data)[0]] ||
        !props.data[Object.keys(props.data)[0]].length
          ? props.firstQueryPath
            ? createWithVariable
            : create
          : props.firstQueryPath
          ? updateWithVariable
          : update,
      onCompleted: props.reRender
    }
  );

  if (Object.keys(values).length === 0) {
    var count = {};
    props.json.schema.forEach(function(v, index) {
      count[index + 1] = {};
    });
    return setValues({ ...count });
  }

  const getData = (info, isItData = false) => {
    var data;
    if (!props.data) {
      return null;
    } else if (info.firstQueryPath) {
      data = objectPath.get(
        objectPath.get(
          props.data,
          `${info.firstQueryPath}.${props.arrayIndex}`
        ),
        info.secondQueryPath
      );
    } else if (props.data) {
      data = objectPath.get(props.data, info.queryPath);
    } else {
      console.error("ERROR, Look Up canvas.js message:", 1234567);
    }
    if (isItData) {
      return data[info.findByIndex ? props.arrayIndex : data.length - 1];
    } else if (info.findByIndex) {
      return data[props.arrayIndex];
    } else {
      return data;
    }
  };

  const prepareDataForSubmit = (variables, key, dictionary) => {
    Object.keys(dictionary).forEach(value => {
      let saveInfo = dictionary[value]["saveInfo"];
      delete dictionary[value]["saveInfo"];
      if (key === "uploadFile") {
        variables[key].push({
          ...saveInfo,
          data: JSON.stringify(dictionary[value]),
          files
        });
      } else {
        variables[key].push({
          ...saveInfo,
          data: JSON.stringify(dictionary[value])
        });
      }
    });
  };

  const handleSubmit = data => {
    // let files;
    // if (data["files"]) {
    //   files = data["files"];
    //   delete data["files"];
    // }
    let variables = {};
    Object.keys(data).forEach(key => {
      variables[key] = [];
      prepareDataForSubmit(variables, key, data[key]);
    });
    mutation({
      variables: {
        ...variables,
        categoryId:
          Number(props.different) === 0 ? Number(props.categoryId) : 0,
        itemId: Number(props.different) ? Number(props.itemId) : 0
      }
    });
    setFiles([]);
  };

  const testForForeignKey = info => {
    if (info.getForeignKey) {
      let foreignKey = objectPath.get(
        props.data,
        info.firstQueryPath + "." + JSON.stringify(props.arrayIndex)
      );
      if (foreignKey) {
        return foreignKey.id;
      } else {
        return 0;
      }
    } else {
      return props.foreignKey;
    }
  };
  const isSubmitButton = count => {
    if (gruppState) {
      if (count === gruppState) {
        return (
          <>
            <SubmitButton onClick={submitHandler.bind(this, count)} />
            {isSubmited && (
              <div style={{ fontSize: 12, color: "red" }}>
                See Error Message
              </div>
            )}
          </>
        );
      }
    } else if (count === grupp) {
      return (
        <>
          <SubmitButton onClick={submitHandler.bind(this, count)} />
          {isSubmited && (
            <div style={{ fontSize: 12, color: "red" }}>See Error Message</div>
          )}
        </>
      );
    }
    return null;
  };
  const submitHandler = count => {
    let submit = true;
    Object.keys(validationPassed).forEach(key => {
      if (!validationPassed[key]) {
        submit = false;
      }
    });
    if (submit) {
      handleSubmit(values[count]);
      setIsSubmited(false);
      setAddForm(!addForm);
      setGruppState(0);
      setvalidationPassed({});
    } else {
      setIsSubmited(true);
    }
  };

  const view = (info, index, count, stopLoop, showEidtButton) => {
    if (info.oneFields) {
      return (
        <MutationGeneral
          {...info}
          {...props}
          key={`${index}-MutationGeneral`}
          data={getData(info)}
          mutation={mutations[info.mutation]}
          query={query[info.query]}
          json={info.fields}
          foreignKey={testForForeignKey(info)}
          count={count}
          stopLoop={stopLoop}
          showEidtButton={showEidtButton}
          index={index}
          setvalidationPassed={setvalidationPassed}
          isSubmited={isSubmited}
          listIndex={0}
          onePage={true}
        />
      );
    } else {
      return (
        <ListUpdateMutation
          {...info}
          {...props}
          key={`${index}-ListUpdateMutation`}
          data={getData(info)}
          mutation={mutations[info.mutation]}
          queryPath={info.queryPath}
          query={query[info.query]}
          foreignKey={testForForeignKey(info)}
          count={count}
          stopLoop={stopLoop}
          showEidtButton={showEidtButton}
          index={index}
          setvalidationPassed={setvalidationPassed}
          isSubmited={isSubmited}
          addForm={addForm}
        />
      );
    }
  };
  var stopLoop = false;
  var grupp = 0;
  const canvas = props.json.schema.map((value, firstIndex) => {
    var sheet;
    if (value.showForm && !grupp) {
      grupp = firstIndex + 1;
    }
    if (stopLoop) {
      sheet = null;
    } else {
      if (
        !getData(value, true) ||
        getData(value, true).data.trim() === "" ||
        !JSON.parse(getData(value, true).data.replace(/'/g, '"'))[
          value.lookUpBy
        ]
      ) {
        grupp = firstIndex + 1;
      }
      sheet = value.sheet.map((info, index) => {
        let showEidtButton = !props.notEidtButton && !index ? true : false;
        var object = view(
          info,
          index,
          firstIndex + 1,
          stopLoop,
          showEidtButton
        );
        return (
          <Fragment key={`${index}-cancas`}>
            {object}
            {index === value.sheet.length - 1 && isSubmitButton(firstIndex + 1)}
          </Fragment>
        );
      });
      if (
        !getData(value, true) ||
        getData(value, true).data.trim() === "" ||
        !JSON.parse(getData(value, true).data.replace(/'/g, '"'))[
          value.lookUpBy
        ]
      ) {
        stopLoop = true;
      }
    }
    return sheet;
  });
  return (
    <ValuesContext.Provider value={{ values, setValues }}>
      <GruppContext.Provider value={{ grupp, gruppState, setGruppState }}>
        <FilesContext.Provider value={{ files, setFiles }}>
          <Container className="mt-0 mt-sm-3 p-0">
            <Card
              className="shadow-sm"
              style={{ minHeight: "80vh", height: "100%" }}
            >
              <Card.Body>
                {canvas}
                {loadingMutation && <p>Loading...</p>}
                {errorMutation && <p>Error :( Please try again</p>}
              </Card.Body>
            </Card>
          </Container>
        </FilesContext.Provider>
      </GruppContext.Provider>
    </ValuesContext.Provider>
  );
}

