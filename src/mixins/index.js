//去掉时间里的T
export const common = {
	setup() {
		function dateFilters(data) {
			return data.replace(/T/, " ");
		}
		// 截取富文本img方法
		function imgFilters(data) {
			var datas = [];
			data.replace(
				/<img [^>]*src=['"]([^'"]+)[^>]*>/,
				function (match, capture) {
					datas.push(capture);
				}
			);
			return datas;
		}
		// 获取富文本的纯文字内容
		//去图片获取全部文本
		const convertIdeogramToNormalCharacter = (val) => {
			const arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
			return val.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
				return arrEntities[t];
			});
		};
		function textFilters(data) {
			let value = data;
			if (data) {
				value = value.replace(/\s*/g, ""); //去掉空格
				value = value.replace(/<[^>]+>/g, ""); //去掉所有的html标记
				value = value.replace(/↵/g, ""); //去掉所有的↵符号
				value = value.replace(/[\r\n]/g, ""); //去掉回车换行
				value = value.replace(/&nbsp;/g, ""); //去掉空格
				value = convertIdeogramToNormalCharacter(value);
				return value;
			} else {
				return null;
			}
		}
		return { dateFilters, imgFilters, textFilters, }
	},
}