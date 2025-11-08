import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraType, setCameraType] = useState('back'); // ✅ ahora son strings
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
      } catch (error) {
        console.log('Error solicitando permisos:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.text}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>❌ No se concedieron permisos</Text>
        <Button
          title="🔄 Volver a pedir permisos"
          onPress={async () => {
            setIsLoading(true);
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
            setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
            setIsLoading(false);
          }}
        />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({ quality: 1 });
        setPhoto(photoData.uri);
        console.log('📸 Foto tomada:', photoData.uri);
      } catch (error) {
        console.log('Error al tomar la foto:', error);
      }
    }
  };

  const savePhoto = async () => {
    if (photo) {
      try {
        await MediaLibrary.createAssetAsync(photo);
        alert('✅ Foto guardada en la galería');
      } catch (error) {
        console.log('Error al guardar la foto:', error);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
        ref={cameraRef}
        onCameraReady={() => console.log('📷 Cámara lista')}
      />

      <View style={styles.controls}>
        <Button title="📷 Tomar Foto" onPress={takePhoto} />
        <Button title="🔁 Cambiar Cámara" onPress={toggleCameraType} />
        <Button title="💾 Guardar Foto" onPress={savePhoto} disabled={!photo} />
      </View>

      {photo && <Image source={{ uri: photo }} style={styles.preview} />}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 5,
    width: '100%',
  },
  controls: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  preview: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00ffcc',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


/*export default function App() {

  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const mostrarMensaje = () => {
    if (nombre.trim() === '') {
      setMensaje('Por favor ingresa tu nombre.');
    } else {
      setMensaje(`¡Hola ${nombre.trim()}!`);
    }
  };

  const limpiar = () => {
    setNombre('');
    setMensaje('');
  };

  const obtenerEmoji = () => {
    if (nombre.trim().length === 0) return '🙂';
    if (nombre.trim().length < 5) return '😄';
    if (nombre.trim().length < 10) return '😁';
    return '🤩';
  };

  return (
    <View style={styles.container}>
      <Text style={[estiloTextos.texto, styles.titulo]}>
        Escribe tu nombre:
      </Text>

      <TextInput
        style={styles.cajaTexto}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingresa tu nombre"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.contador}>
        Caracteres: {nombre.trim().length} {obtenerEmoji()}
      </Text>

      {}
      <View style={styles.botonesContainer}>
        <TouchableOpacity style={[styles.boton, styles.botonMostrar]} onPress={mostrarMensaje}>
          <Text style={styles.textoBoton}>Mostrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonLimpiar]} onPress={limpiar}>
          <Text style={styles.textoBoton}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[estiloTextos.texto, styles.mensaje]}>{mensaje}</Text>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
  },
  cajaTexto: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderColor: '#BD93BD',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    width: 250,
    textAlign: 'center',
    fontSize: 16,
  },
  contador: {
    color: '#ccc',
    marginVertical: 10,
  },
  botonesContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    gap: 15,
    marginVertical: 15,
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: 120,
    alignItems: 'center',
  },
  botonMostrar: {
    backgroundColor: '#BD93BD',
  },
  botonLimpiar: {
    backgroundColor: '#FF5555',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mensaje: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
});*/
