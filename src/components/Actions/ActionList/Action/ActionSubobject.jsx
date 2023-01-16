import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { getTime } from "../../../../scripts/frontend";
import ActionEffort from "./ActionEffort";
import ActionHeader from "./ActionHeader/ActionHeader";
import ActionMarkdown from "./ActionMarkdown";
import ActionResources from "./ActionResources";


const ActionSubObject = (props) => {
  const { subObject, toggleAssetInfo, toggleEdit } = props;
  return ( 
    <div key={subObject._id}>
      <ActionHeader
          action={subObject}
          time={getTime(subObject.submission.createdAt)}
          toggleEdit={toggleEdit}
      />
      <Box>
          <ActionMarkdown
              header='Description'
              markdown={subObject.submission.description}
          />
          <ActionMarkdown
              tooltip='An out of character explanation of what you, the player, want to happen as a result.'
              header='Intent'
              markdown={subObject.submission.intent}
          />
          <ActionEffort
              submission={subObject.submission}
          />
          <ActionResources
              assets={subObject.submission.assets}
              toggleAssetInfo={toggleAssetInfo}
          />
      </Box>
    </div>
   );
}
 
export default ActionSubObject;