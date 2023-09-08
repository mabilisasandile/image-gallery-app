import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImagePreview = () => {

  return (
    <View style={styles.container}>
      <Text>Image preview page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageView: {
        width: '100%', 
        height: '100%'
    }
});

export default ImagePreview;



// import React from 'react';
// import { View, Image } from 'react-native';

// const ImagePreview = ({ route }) => {
//   const { image } = route.params;

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: image.uri }} style={styles.imageView} />
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     imageView: {
//         width: '100%', 
//         height: '100%'
//     }
// });


// export default ImagePreview;
