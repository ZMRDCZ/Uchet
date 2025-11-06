<template>
  <div 
    class="modal fade" 
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1" 
    aria-labelledby="avatarUploadModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="avatarUploadModalLabel" class="modal-title">
            <i class="fas fa-camera me-2"></i>
            Изменить фото профиля
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            aria-label="Закрыть"
          ></button>
        </div>
        
        <div class="modal-body">
          <!-- Текущее фото -->
          <div class="current-avatar-section mb-4">
            <div class="current-avatar">
              <div v-if="currentAvatar" class="avatar-image">
                <img :src="currentAvatar" alt="Текущее фото" />
              </div>
              <div v-else class="avatar-placeholder">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <p class="text-center text-muted mt-2">Текущее фото</p>
          </div>

          <!-- Выбор способа загрузки -->
          <div class="upload-methods mb-4">
            <div class="row g-3">
              <div class="col-md-6">
                <div 
                  class="upload-option"
                  :class="{ active: uploadMethod === 'file' }"
                  @click="uploadMethod = 'file'"
                >
                  <i class="fas fa-upload"></i>
                  <span>Загрузить файл</span>
                </div>
              </div>
              <div class="col-md-6">
                <div 
                  class="upload-option"
                  :class="{ active: uploadMethod === 'camera' }"
                  @click="uploadMethod = 'camera'"
                >
                  <i class="fas fa-camera"></i>
                  <span>Сделать фото</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Загрузка файла -->
          <div v-if="uploadMethod === 'file'" class="file-upload-section">
            <div 
              class="file-drop-zone"
              :class="{ 
                'drag-over': isDragOver,
                'has-file': selectedFile && !previewUrl
              }"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleFileDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                style="display: none"
              />
              
              <div v-if="!selectedFile" class="drop-zone-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <p class="mb-2">Перетащите изображение сюда или нажмите для выбора</p>
                <small class="text-muted">
                  Поддерживаются форматы: JPG, PNG, GIF (макс. {{ maxFileSize }}MB)
                </small>
              </div>
              
              <div v-else-if="!previewUrl" class="file-info">
                <i class="fas fa-file-image"></i>
                <p class="mb-1">{{ selectedFile.name }}</p>
                <small class="text-muted">{{ formatFileSize(selectedFile.size) }}</small>
              </div>
            </div>

            <!-- Предварительный просмотр и обрезка -->
            <div v-if="previewUrl" class="preview-section mt-4">
              <div class="preview-container">
                <div class="cropper-container" ref="cropperContainer">
                  <img 
                    ref="cropperImage" 
                    :src="previewUrl" 
                    alt="Предварительный просмотр"
                  />
                </div>
                
                <div class="crop-controls">
                  <div class="control-group">
                    <label>Масштаб:</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.1" 
                      v-model="cropScale"
                      @input="updateCropScale"
                      class="form-range"
                    />
                  </div>
                  
                  <div class="control-buttons">
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-secondary"
                      @click="rotateCrop(-90)"
                    >
                      <i class="fas fa-undo"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-secondary"
                      @click="rotateCrop(90)"
                    >
                      <i class="fas fa-redo"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-secondary"
                      @click="resetCrop"
                    >
                      <i class="fas fa-refresh"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Результат обрезки -->
              <div class="crop-result">
                <div class="result-preview">
                  <canvas ref="resultCanvas" width="150" height="150"></canvas>
                </div>
                <p class="text-center text-muted mt-2">Результат</p>
              </div>
            </div>
          </div>

          <!-- Съемка с камеры -->
          <div v-if="uploadMethod === 'camera'" class="camera-section">
            <div v-if="!cameraStream && !capturedImage" class="camera-start">
              <div class="camera-placeholder">
                <i class="fas fa-video"></i>
                <p>Нажмите для включения камеры</p>
                <button class="btn btn-primary" @click="startCamera">
                  <i class="fas fa-play me-2"></i>
                  Включить камеру
                </button>
              </div>
            </div>

            <div v-if="cameraStream && !capturedImage" class="camera-active">
              <video 
                ref="videoElement" 
                autoplay 
                muted
                class="camera-video"
              ></video>
              
              <div class="camera-controls">
                <button class="btn btn-primary btn-lg" @click="capturePhoto">
                  <i class="fas fa-camera"></i>
                </button>
                <button class="btn btn-secondary" @click="stopCamera">
                  <i class="fas fa-stop"></i>
                </button>
              </div>
            </div>

            <div v-if="capturedImage" class="captured-photo">
              <img :src="capturedImage" alt="Снятое фото" class="captured-image" />
              
              <div class="capture-controls">
                <button class="btn btn-outline-secondary" @click="retakePhoto">
                  <i class="fas fa-redo me-2"></i>
                  Переснять
                </button>
                <button class="btn btn-primary" @click="useCapturedPhoto">
                  <i class="fas fa-check me-2"></i>
                  Использовать это фото
                </button>
              </div>
            </div>
          </div>

          <!-- Предустановленные аватары -->
          <div class="preset-avatars-section mt-4">
            <h6 class="mb-3">
              <i class="fas fa-user-circle me-2"></i>
              Или выберите готовый аватар
            </h6>
            <div class="preset-avatars">
              <div 
                v-for="avatar in presetAvatars" 
                :key="avatar.id"
                class="preset-avatar"
                :class="{ selected: selectedPreset === avatar.id }"
                @click="selectPresetAvatar(avatar)"
              >
                <img :src="avatar.url" :alt="avatar.name" />
              </div>
            </div>
          </div>

          <!-- Сообщения об ошибках -->
          <div v-if="error" class="alert alert-danger mt-3">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Отмена
          </button>
          <button 
            type="button" 
            class="btn btn-danger"
            v-if="currentAvatar"
            @click="removeAvatar"
            :disabled="isUploading"
          >
            <i class="fas fa-trash me-2"></i>
            Удалить фото
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="uploadAvatar"
            :disabled="!canUpload || isUploading"
          >
            <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-2"></i>
            {{ isUploading ? 'Загрузка...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Backdrop -->
  <div 
    v-if="modelValue" 
    class="modal-backdrop fade show"
    @click="closeModal"
  ></div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AvatarUploadModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'uploaded'],
  setup(props, { emit }) {
    const toast = useToast()
    const authStore = useAuthStore()

    // Состояние
    const isUploading = ref(false)
    const uploadMethod = ref('file')
    const selectedFile = ref(null)
    const previewUrl = ref('')
    const isDragOver = ref(false)
    const error = ref('')
    const cropScale = ref(1)
    const selectedPreset = ref(null)
    const cameraStream = ref(null)
    const capturedImage = ref('')
    
    // Рефы
    const fileInput = ref(null)
    const cropperImage = ref(null)
    const cropperContainer = ref(null)
    const resultCanvas = ref(null)
    const videoElement = ref(null)
    
    // Cropper instance
    let cropper = null
    
    // Настройки
    const maxFileSize = 5 // MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    
    const presetAvatars = ref([
      { id: 1, name: 'Аватар 1', url: '/avatars/preset-1.svg' },
      { id: 2, name: 'Аватар 2', url: '/avatars/preset-2.svg' },
      { id: 3, name: 'Аватар 3', url: '/avatars/preset-3.svg' },
      { id: 4, name: 'Аватар 4', url: '/avatars/preset-4.svg' },
      { id: 5, name: 'Аватар 5', url: '/avatars/preset-5.svg' },
      { id: 6, name: 'Аватар 6', url: '/avatars/preset-6.svg' }
    ])

    // Вычисляемые свойства
    const currentAvatar = computed(() => {
      return authStore.user?.avatar || ''
    })

    const canUpload = computed(() => {
      return selectedFile.value || selectedPreset.value || capturedImage.value
    })

    // Методы валидации
    const validateFile = (file) => {
      if (!allowedTypes.includes(file.type)) {
        return 'Неподдерживаемый формат файла. Используйте JPG, PNG или GIF.'
      }
      
      if (file.size > maxFileSize * 1024 * 1024) {
        return `Размер файла не должен превышать ${maxFileSize}MB.`
      }
      
      return ''
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Методы работы с файлами
    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        processFile(file)
      }
    }

    const handleFileDrop = (event) => {
      isDragOver.value = false
      const file = event.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    }

    const processFile = (file) => {
      error.value = ''
      
      const validationError = validateFile(file)
      if (validationError) {
        error.value = validationError
        return
      }

      selectedFile.value = file
      selectedPreset.value = null
      
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target.result
        initializeCropper()
      }
      reader.readAsDataURL(file)
    }

    // Методы обрезки
    const initializeCropper = async () => {
      // Ждем следующий тик для загрузки DOM
      await nextTick()
      
      if (cropperImage.value && window.Cropper) {
        if (cropper) {
          cropper.destroy()
        }
        
        cropper = new window.Cropper(cropperImage.value, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 0.8,
          restore: false,
          guides: false,
          center: false,
          highlight: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          toggleDragModeOnDblclick: false,
          crop: updateCropPreview
        })
      }
    }

    const updateCropScale = () => {
      if (cropper) {
        cropper.scale(parseFloat(cropScale.value))
        updateCropPreview()
      }
    }

    const rotateCrop = (degree) => {
      if (cropper) {
        cropper.rotate(degree)
        updateCropPreview()
      }
    }

    const resetCrop = () => {
      if (cropper) {
        cropper.reset()
        cropScale.value = 1
        updateCropPreview()
      }
    }

    const updateCropPreview = () => {
      if (cropper && resultCanvas.value) {
        const canvas = cropper.getCroppedCanvas({
          width: 150,
          height: 150
        })
        
        const ctx = resultCanvas.value.getContext('2d')
        ctx.clearRect(0, 0, 150, 150)
        ctx.drawImage(canvas, 0, 0, 150, 150)
      }
    }

    // Методы работы с камерой
    const startCamera = async () => {
      try {
        error.value = ''
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480 
          } 
        })
        
        cameraStream.value = stream
        
        if (videoElement.value) {
          videoElement.value.srcObject = stream
        }
      } catch (err) {
        console.error('Ошибка доступа к камере:', err)
        error.value = 'Не удалось получить доступ к камере. Проверьте разрешения.'
      }
    }

    const stopCamera = () => {
      if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop())
        cameraStream.value = null
      }
    }

    const capturePhoto = () => {
      if (videoElement.value) {
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 480
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(videoElement.value, 0, 0, 640, 480)
        
        capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
        stopCamera()
      }
    }

    const retakePhoto = () => {
      capturedImage.value = ''
      startCamera()
    }

    const useCapturedPhoto = () => {
      selectedFile.value = null
      selectedPreset.value = null
      // Можно добавить обрезку для камеры если нужно
    }

    // Методы предустановленных аватаров
    const selectPresetAvatar = (avatar) => {
      selectedPreset.value = avatar.id
      selectedFile.value = null
      previewUrl.value = ''
      capturedImage.value = ''
      error.value = ''
      
      if (cropper) {
        cropper.destroy()
        cropper = null
      }
    }

    // Методы загрузки
    const uploadAvatar = async () => {
      try {
        isUploading.value = true
        error.value = ''

        let imageData = ''

        if (selectedPreset.value) {
          // Использование предустановленного аватара
          const preset = presetAvatars.value.find(a => a.id === selectedPreset.value)
          imageData = preset.url
        } else if (capturedImage.value) {
          // Использование снятого фото
          imageData = capturedImage.value
        } else if (cropper) {
          // Использование обрезанного изображения
          const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300
          })
          imageData = canvas.toDataURL('image/jpeg', 0.8)
        } else {
          error.value = 'Выберите изображение для загрузки'
          return
        }

        // Здесь будет API вызов для загрузки аватара
        // const formData = new FormData()
        // formData.append('avatar', imageData)
        // const response = await api.post('/users/me/avatar', formData)
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        emit('uploaded', imageData)
        closeModal()
        toast.success('Фото профиля успешно обновлено!')
      } catch (error) {
        console.error('Ошибка загрузки аватара:', error)
        error.value = 'Ошибка при загрузке фото. Попробуйте еще раз.'
      } finally {
        isUploading.value = false
      }
    }

    const removeAvatar = async () => {
      try {
        isUploading.value = true
        
        // Здесь будет API вызов для удаления аватара
        // await api.delete('/users/me/avatar')
        
        // Имитация удаления
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        emit('uploaded', null)
        closeModal()
        toast.success('Фото профиля удалено')
      } catch (error) {
        console.error('Ошибка удаления аватара:', error)
        error.value = 'Ошибка при удалении фото'
      } finally {
        isUploading.value = false
      }
    }

    // Методы модального окна
    const closeModal = () => {
      resetState()
      emit('update:modelValue', false)
    }

    const resetState = () => {
      selectedFile.value = null
      previewUrl.value = ''
      selectedPreset.value = null
      capturedImage.value = ''
      error.value = ''
      cropScale.value = 1
      isDragOver.value = false
      uploadMethod.value = 'file'
      
      if (cropper) {
        cropper.destroy()
        cropper = null
      }
      
      stopCamera()
    }

    // Watchers
    watch(() => props.modelValue, (newValue) => {
      if (!newValue) {
        resetState()
      }
    })

    // Инициализация
    onMounted(() => {
      // Можно добавить загрузку Cropper.js если он не подключен глобально
    })

    onUnmounted(() => {
      stopCamera()
      if (cropper) {
        cropper.destroy()
      }
    })

    return {
      isUploading,
      uploadMethod,
      selectedFile,
      previewUrl,
      isDragOver,
      error,
      cropScale,
      selectedPreset,
      cameraStream,
      capturedImage,
      fileInput,
      cropperImage,
      cropperContainer,
      resultCanvas,
      videoElement,
      maxFileSize,
      presetAvatars,
      currentAvatar,
      canUpload,
      
      formatFileSize,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop,
      updateCropScale,
      rotateCrop,
      resetCrop,
      startCamera,
      stopCamera,
      capturePhoto,
      retakePhoto,
      useCapturedPhoto,
      selectPresetAvatar,
      uploadAvatar,
      removeAvatar,
      closeModal
    }
  }
}
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
}

.modal-title {
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
}

/* Текущий аватар */
.current-avatar-section {
  text-align: center;
}

.current-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e9ecef;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 3rem;
}

/* Методы загрузки */
.upload-methods {
  display: flex;
  gap: 1rem;
}

.upload-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.upload-option:hover {
  border-color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.05);
}

.upload-option.active {
  border-color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.upload-option i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-option span {
  font-weight: 500;
}

/* Загрузка файла */
.file-drop-zone {
  border: 2px dashed #e9ecef;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.file-drop-zone:hover,
.file-drop-zone.drag-over {
  border-color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.05);
}

.file-drop-zone.has-file {
  border-color: #198754;
  background: rgba(25, 135, 84, 0.05);
}

.drop-zone-content i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.file-info i {
  font-size: 2rem;
  color: #198754;
  margin-bottom: 0.5rem;
}

/* Предварительный просмотр */
.preview-section {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.preview-container {
  flex: 1;
}

.cropper-container {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.cropper-container img {
  max-width: 100%;
  max-height: 100%;
}

.crop-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-group {
  flex: 1;
}

.control-group label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
}

.crop-result {
  text-align: center;
}

.result-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e9ecef;
  margin: 0 auto;
}

.result-preview canvas {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/* Камера */
.camera-section {
  text-align: center;
}

.camera-placeholder {
  padding: 3rem 2rem;
  border: 2px dashed #e9ecef;
  border-radius: 1rem;
  background: #fafafa;
}

.camera-placeholder i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.camera-placeholder p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.camera-active {
  position: relative;
  display: inline-block;
}

.camera-video {
  width: 100%;
  max-width: 480px;
  border-radius: 1rem;
  background: #000;
}

.camera-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.captured-photo {
  max-width: 480px;
  margin: 0 auto;
}

.captured-image {
  width: 100%;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.capture-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Предустановленные аватары */
.preset-avatars-section h6 {
  color: #333;
  font-weight: 600;
}

.preset-avatars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
}

.preset-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-avatar:hover {
  border-color: var(--bs-primary);
  transform: scale(1.05);
}

.preset-avatar.selected {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 2px rgba(var(--bs-primary-rgb), 0.3);
}

.preset-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Кнопки */
.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.5rem;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .upload-methods {
    flex-direction: column;
  }
  
  .preview-section {
    flex-direction: column;
  }
  
  .crop-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-buttons {
    justify-content: center;
  }
  
  .preset-avatars {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}

/* Темная тема */
[data-theme="dark"] .modal-content {
  background-color: #2d2d2d;
}

[data-theme="dark"] .current-avatar {
  border-color: #444444;
}

[data-theme="dark"] .avatar-placeholder {
  background-color: #1a1a1a;
  color: #adb5bd;
}

[data-theme="dark"] .upload-option {
  border-color: #444444;
  background-color: #1a1a1a;
  color: #ffffff;
}

[data-theme="dark"] .upload-option:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

[data-theme="dark"] .file-drop-zone {
  border-color: #444444;
  background-color: #1a1a1a;
}

[data-theme="dark"] .camera-placeholder {
  border-color: #444444;
  background-color: #1a1a1a;
}

[data-theme="dark"] .cropper-container {
  background-color: #1a1a1a;
}

[data-theme="dark"] .preset-avatar {
  border-color: #444444;
}

[data-theme="dark"] .result-preview {
  border-color: #444444;
}

[data-theme="dark"] .modal-footer {
  border-color: #444444;
}

/* Анимации */
.modal.fade .modal-dialog {
  transition: transform 0.3s ease-out;
  transform: translate(0, -50px);
}

.modal.show .modal-dialog {
  transform: none;
}

.preset-avatar {
  transition: all 0.2s ease;
}

.upload-option {
  transition: all 0.2s ease;
}

.file-drop-zone {
  transition: all 0.2s ease;
}

/* Состояния загрузки */
.uploading .file-drop-zone,
.uploading .preset-avatar,
.uploading .upload-option {
  pointer-events: none;
  opacity: 0.6;
}

/* Улучшения доступности */
.btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.upload-option:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.preset-avatar:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

/* Индикаторы прогресса */
.upload-progress {
  position: relative;
  overflow: hidden;
}

.upload-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>