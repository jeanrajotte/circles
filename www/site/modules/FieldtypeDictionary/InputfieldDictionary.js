$(document).ready(function() {

	$(document).on("click", ".InputfieldDictionaryAdd", function(e) {
		$(this).removeClass('ui-state-active'); 
		var $row = $(this).parents(".InputfieldDictionary").find("tr.DictionaryTemplate"); 
		$row.parent('tbody').append($row.clone().hide().removeClass('DictionaryTemplate').css('display', 'table-row').fadeIn()); 
		var id = $(this).attr('id'); 
		setTimeout("$('#" + id + "').removeClass('ui-state-active')", 500); 
		return false; 
	});	

	$(document).on("click", ".InputfieldDictionary a.DictionaryClone", function(e) {
		var $row = $(this).parents("tr.Dictionary"); 
		var $table = $(this).parents("table.InputfieldDictionary"); 
		$table.append($row.clone().hide().css('display', 'table-row').fadeIn()); 
		return false; 
	}); 

	$(document).on("click", ".InputfieldDictionary a.DictionaryDel", function(e) {
		var $row = $(this).parents("tr.Dictionary"); 
		if($row.size() == 0) {
			// delete all
			$(this).parents("thead").next("tbody").find('.DictionaryDel').click();
			return false; 	
		}
		var $input = $(this).next('input'); 
		if($input.val() == 1) {
			$input.val(0); 
			$row.removeClass("DictionaryTBD"); 
			$row.removeClass('ui-state-error'); 
		} else {
			$input.val(1); 
			$row.addClass("DictionaryTBD"); 
			$row.addClass('ui-state-error');
		}
		return false; 
	}); 


}); 
