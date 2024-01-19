import { useState, useEffect, useRef } from "react";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { quizConfig, quizConfig_en } from "../data/quizConfig";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function AppWorkspace() {
  const player = useRef();
  const [shuffledQuiz,setShuffledQuiz] = useState(shuffleArray([...quizConfig.questions]));
  const [curPickedObj, setCurPickedObj] = useState();
  const [curAudioSrc, setCurAudioSrc] = useState();
  const [chosen,setChosen] = useState({})
  const [curConfig,setCurConfig] = useState({})

  useEffect(() => {
    let useConfig = quizConfig

    // Handle different languages - here is the handling of English
    const url = (new URL(window.location.href))
    const urlParts = url.pathname.replace(/^\/(u\/){0,1}/, "").replace(/\/+$/, "").replace(/preview\/(tag|branch)/, "").split("/") || []
    if (urlParts && (urlParts.length>=0) && (urlParts[0]==="en")) {
      setCurConfig(quizConfig_en)
      useConfig = quizConfig_en
    } else {
    // Default language is German
    setCurConfig(quizConfig)
    }

    // Create a copy, with all needed fields
    const quizCopy = useConfig.questions.map((item, inx) => {
      return { ...item, shuffled: true, shuffleInx: inx }
    })
    // Shuffle in place - i.e changing the quizCopy array
    shuffleArray(quizCopy)
    setShuffledQuiz(quizCopy)

  }, [])

  // eslint-disable-next-line no-unused-vars
  const removeKey = (key, { [key]: _, ...rest }) => rest;
  const addChosen = (inx,newId) => setChosen(prev => ({ ...prev, [newId]: inx }))
  const removeChosen = (removeId) => setChosen(prev => removeKey(removeId,prev))
 
  const pickObj = (item) => {
    // set up player - clear/reset waiting item
    setCurPickedObj(item);
    setCurAudioSrc(item.audioSrc)
  }

  const handleClick = (item) => pickObj(item)

  const handleSelectedClick = (selectedIdStr, index, item) => {
    if (item.fixed || curPickedObj?.fixed) {
      setCurPickedObj(undefined);
      setCurAudioSrc(item.audioSrc)
    } else if (!selectedIdStr || curPickedObj) {
      // clear player - use picked item and set selected value in shuffled array
      setCurAudioSrc("")
      const newSelectValue = curPickedObj?.idStr
      setCurPickedObj(undefined);
      if (item.selected) {
        // first clear previous selection
        removeChosen(item.selected)
      }
      item.selected = newSelectValue
      addChosen(index,newSelectValue)
    } else {
      removeChosen(selectedIdStr)
      item.selected = undefined
      const useItem = curConfig.questions.find(item => (item.idStr === selectedIdStr))
      pickObj(useItem)
    } 
  }

  return (
    <Sheet sx={{ maxWidth: "800px", backgroundColor: "#fafafa" }}>
      <Grid
        variant="outlined"
        justifyContent="center"
        alignItems="center"
        sx={{ borderRadius: "md", display: "flex", gap: 2, p: 0.5 }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontSize: '1.7rem', color: "darkpurple", display: { sm: "block" } }}
        >
          <b>{curConfig.title}</b>
        </Typography>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2}
          sx={{ mr: 1 }}
          >
          {curConfig?.questions?.map((item, index) => {
            const idStr = item.idStr;
            const isSelected = (chosen[idStr]!=null)
            const isPicked = (idStr === curPickedObj?.title)
            const disabled = 
                       item.fixed 
                       || isSelected
                       || isPicked
            return (
              <Grid
                key={index}
                xs={4}
                sm={3}
                md={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant={ isPicked ? "outlined" : "solid" }
                  disabled={disabled}
                  sx={{ ml: 1.5, width: "100%", display: "block" }}
                  onClick={() => handleClick(item)}
                >
                  <span>  </span>{idStr}<span>  </span>  
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <br/>
      {!curPickedObj?.idStr && <br/>}
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            xs={12}
            sm={12}
            md={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
          {curPickedObj?.idStr && (
            <Box>
              <span>{curConfig.selectPrompt}</span>
              <Button variant={"solid"}>{curPickedObj.idStr}</Button>
            </Box>
          )}
          </Grid>

        </Grid>
      </Box>
      <AudioPlayer 
        autoPlay 
        src={curAudioSrc} 
        ref={player} 
        sx={{ color: 'lightgrey' }}
      />
      <br/>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          sx={{ mr: 1 }}
          spacing={2}
        >
          {shuffledQuiz &&
            shuffledQuiz.map((item, index) => {
              const title = item.title;
              const fixed = item.fixed;
              const hasSelection = fixed || item.selected
              const idStr = item.idStr;
              const selectedId = fixed ? idStr : item.selected;
              // improve disabled state !!!
              const disabled = !hasSelection && !curPickedObj;
              return (
                <Grid
                  key={title}
                  xs={6}
                  sm={4}
                  md={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    variant={selectedId ? "solid" : "outlined"}
                    disabled={disabled}
                    sx={selectedId 
                      ? { ml: 1.5, background: 'darkgreen' }
                      : { ml: 1.5 }
                    }
                    onClick={() => handleSelectedClick(item.selected, index, item)}
                  >
                    {selectedId ? title + " -> " + selectedId : title}
                  </Button>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Sheet>
  );
}
