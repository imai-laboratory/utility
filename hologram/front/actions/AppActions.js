import AppConstants from '../constants/AppConstants'
import AppDispatcher from '../dispatcher/AppDispatcher'
import Api from '../api/Api'

const actions = {
  loadDirectories: () => {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOAD_DIRECTORIES_STARTED
    })
    Api.getDirectories()
      .then((data) => {
        actions.loadDirectoriesCompleted(data.dirs)
      })
  },
  loadDirectoriesCompleted: (directories) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOAD_DIRECTORIES_COMPLETED,
      directories: directories
    })
    for (let directory of directories) {
      for (let file of directory.files) {
        if (/.*.json$/.test(file)) {
          actions.loadContent(directory.directory, file)
        }
      }
    }
  },
  loadContent: (dirName, fileName) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOAD_CONTENT_STARTED,
      dirName: dirName,
      fileName: fileName
    })
    Api.getContent(dirName, fileName)
      .then((data) => {
        actions.loadContentCompleted(dirName, fileName, data.content)
      })
  },
  loadContentCompleted: (dirName, fileName, content) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOAD_CONTENT_COMPLETED,
      dirName: dirName,
      fileName: fileName,
      content: content
    })
  },
  changeXAxis: (value) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_X_AXIS,
      value: value
    })
  },
  changeYAxis: (value) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_Y_AXIS,
      value: value
    })
  },
  changeFile: (value) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_FILE,
      file: value
    })
  },
  changeWindowSize: (value) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_WINDOW_SIZE,
      value: value
    })
  },
  enableDirectory: (value) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.ENABLE_DIRECTORY,
      value: value
    })
  },
  disableDirectory: (value) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.DISABLE_DIRECTORY,
      value: value
    })
  },
}

export default actions
