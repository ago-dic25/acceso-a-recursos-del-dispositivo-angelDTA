import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para guardar fotos en la galería.');
      }
    })();
  }, []);


  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No se concedieron permisos para la camara.</Text>
        <Button title="Conceder permisos" onPress={requestPermission} />
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const fotoData = await cameraRef.current.takePictureAsync();
        setFoto(fotoData.uri);
        console.log('Foto tomada:', fotoData.uri);
        await MediaLibrary.saveToLibraryAsync(fotoData.uri);
        console.log('Foto guardada');
      } catch (error) {
        console.log('Error al tomar la foto:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '90%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
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
