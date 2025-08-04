CREATE OR REPLACE FUNCTION public.increment_comment_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.posts 
  SET comment_count = comment_count + 1 
  WHERE id = post_id;
END;
$function$