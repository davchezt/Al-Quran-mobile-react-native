import React, { Component } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import CardView from 'react-native-cardview';
import { Styles } from './Quran_detail.styles';
import { Colors } from '../../Utils/Colors';
import { quranDetail } from '../../Utils/EndPoints';

class QuranList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailSurah: [],
      refreshing: false,
    };
  }

  static navigationOptions = ({
    navigation: {
      state: {
        params: { dataSurah },
      },
    },
  }) => {
    const suratName = dataSurah.surat_name;
    const suratArabic = dataSurah.surat_text;
    const suratTranslate = dataSurah.surat_terjemahan;
    const countAyat = dataSurah.count_ayat;
    return {
      headerTitle: (
        <View>
          <Text style={Styles.headerTitle}>
            {suratName} ({suratArabic})
          </Text>
          <Text style={Styles.headerSubtitle}>
            {suratTranslate} - {countAyat} Ayat
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  componentDidMount() {
    this.renderDetailSurah();
  }

  renderDetailSurah = async () => {
    const { dataSurah } = this.props.navigation.state.params;
    const surah_id = dataSurah.id;
    const jml_ayat = dataSurah.count_ayat;

    try {
      const res = await axios.get(quranDetail(surah_id, jml_ayat));
      const detailSurah = res.data.data;
      this.setState({
        detailSurah,
      });
    } catch (error) {
      throw error;
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => this.renderDetailSurah());
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  };

  renderCardContent = ({ item }) => {
    return (
      <CardView
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={5}
        style={Styles.CardStyle}>
        <View style={Styles.cardContainer}>
          <View style={Styles.numberCircleContainer}>
            <View style={Styles.NumberCircle}>
              <Text style={Styles.textNumber}>{item.aya_number}</Text>
            </View>
          </View>
          <View style={Styles.descContainer}>
            <Text style={Styles.descTextRight}>{item.aya_text}</Text>
            <Text style={Styles.descTextLeft}>{item.translation_aya_text}</Text>
          </View>
        </View>
      </CardView>
    );
  };

  render() {
    const { detailSurah, refreshing } = this.state;
    return (
      <View>
        <FlatList
          data={detailSurah}
          keyExtractor={(list, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderCardContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

export default QuranList;
