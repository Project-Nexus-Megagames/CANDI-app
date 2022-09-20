import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, TagPicker, ButtonGroup, Panel, IconButton } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
const data = [];

const CompactCell = props => <Cell {...props} style={{ padding: 4 }} />;
const CompactHeaderCell = props => <HeaderCell {...props} style={{ padding: 4 }} />;

const defaultColumns = [
  {
    key: 'creator',
    label: 'Character',
    width: 100
  },
  {
    key: 'name',
    label: 'Action Name',
    width: 330
  },
  {
    key: 'submission',
    label: 'Assets',
    width: 330
  },
  {
    key: 'controllers',
    label: 'Controllers',
    width: 200
  },



  {
    key: 'edit',
    label: 'edit',
    flexGrow: 1
  }
];

const renderAsset = (assetID, assets) => {
  if (assetID) {
    const asset = assets.find((el) => el._id === assetID);
    if (asset)
      return (
          <b className="normalText">({asset.dice}), </b>
      );
    else return <b>Could not render for asset {assetID}</b>;
  } 
};

const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} >
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData._id);
        }}
      >
        {rowData.status === 'EDIT' ? 'Save' : 'Edit'}
      </Button>
    </Cell>
  );
};

const CreatorCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{  }}>
      {rowData[dataKey].characterName}
    </Cell>
  );
};

const AssetCell = ({ rowData, dataKey, onClick, ...props }) => {
  const assets = useSelector((state) => state.assets.list);
  console.log(dataKey)
  return (
    <Cell {...props} style={{  }}>
      {rowData[dataKey].assets.map((ass) => (
        renderAsset(ass, assets)
      ))}
      
      {rowData[dataKey].assets}
    </Cell>
  );
};

const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = props.editingID === rowData._id;
  return (
    <Cell {...props} className={editing ? 'table-content-editing' : ''}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={event => {
            onChange && onChange(rowData._id, dataKey, event.target.value);
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  );
};

const ActionTable = (props) => {
  const [editing, setEditing] = React.useState(false);
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map(column => column.key));
	

	const actions = useSelector((state) => state.actions.list);
  const [data, setData] = React.useState(actions);

  const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
  const CustomHeaderCell = HeaderCell;

  const handleChange = (id, key, value) => {
    let nextData =  [ ...data ];
    let temp = { ...nextData.find(item => item._id === id) }//[key] = value;

    console.log(temp[key], value)
    temp[key] = value
    nextData.push(temp);
    console.log(nextData)
    setData(nextData);
  };

  const handleEditState = _id => {
    setEditing(_id)
  };

  return (
    <div>

      Columns：
      <TagPicker
        data={defaultColumns}
        labelKey="label"
        valueKey="key"
        value={columnKeys}
        onChange={setColumnKeys}
        cleanable={false}
      />
      <hr />
      <div style={{ height: 'auto' }}>
        <Table
          height={500}
          data={actions}
          bordered
          cellBordered
          headerHeight={40}
          rowHeight={46}
        >
          {columns.map(column => {
            const { key, label, ...rest } = column;
            switch (label) {
              case ('edit'): 
              return (
                <Column flexGrow={1}>
                 <HeaderCell>...</HeaderCell>
                 <ActionCell dataKey="id" onClick={handleEditState} />
               </Column>
              )
              case ('Character'): 
              return (
                <Column flexGrow={1}>
                 <HeaderCell>{label}</HeaderCell>
                 <CreatorCell dataKey={key} onClick={handleEditState} />
               </Column>
              )
              case ('Assets'): 
              return (
                <Column flexGrow={1}>
                 <HeaderCell>{label}</HeaderCell>
                 <AssetCell dataKey={key} onClick={handleEditState} />
               </Column>
              )
              default:
                return (
                  <Column {...rest} key={key}>
                    <CustomHeaderCell>{label}</CustomHeaderCell>
                    <EditableCell onChange={handleChange} dataKey={key} editingID={editing}/>
                  </Column>
                );
            }

          })}
        </Table>
      </div>
    </div>
  );
};

export default ActionTable;